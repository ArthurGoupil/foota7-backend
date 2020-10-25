import * as express from 'express';
import axios from 'axios';
import * as parse5 from 'parse5';

import { IHTMLNode, ICalendarOfGames } from '../types/ParsedHTMLTypes';

const router = express.Router();

router.get('/fgst-data', async (req, res) => {
  try {
    const response = await axios.get(
      'http://footfsgtidf.org/calendriers.php?g=4829',
      // Getting the response in binary so that it is not encoded yet, then we can convert it with proper accented characters
      { responseType: 'arraybuffer' }
    );

    const parsedResponse: any = parse5.parse(response.data.toString('latin1'));

    const numberOfDays = 14;
    const numberOfGamesPerDay = 4;
    const calendarOfGames: ICalendarOfGames = [];
    let numberOfParsedDivTags = 0;
    const childrenOfTdContainer: Array<IHTMLNode> =
      parsedResponse.childNodes[0].childNodes[1].childNodes[3].childNodes[1]
        .childNodes[0].childNodes[3].childNodes[7].childNodes[1].childNodes[0]
        .childNodes[1].childNodes;
    let dayIndex = 0;
    let gameOfDayIndex = 0;

    // Looping inside all children to find games
    childrenOfTdContainer.forEach((child: IHTMLNode) => {
      if (child.tagName === 'div') {
        if (numberOfParsedDivTags < numberOfDays * numberOfGamesPerDay) {
          const gameHTMLNode =
            child.childNodes[1].childNodes[1].childNodes[1].childNodes[0]
              .childNodes;

          // Create an array for the day if needed
          if (gameOfDayIndex === 0) {
            calendarOfGames[dayIndex] = [];
          }

          let date: string;
          // Condition below is caused by bad coding of fsgt website - date is not always in the same HTML Node
          if (numberOfParsedDivTags < 16) {
            date = gameHTMLNode[3].childNodes[0].childNodes[0].value.trim();
          } else {
            date = gameHTMLNode[3].childNodes[0].childNodes[1].childNodes[0].value.trim();
          }
          const firstTeam: string = gameHTMLNode[5].childNodes[0].childNodes[1].childNodes[0].value.trim();
          const secondTeam: string = gameHTMLNode[9].childNodes[0].childNodes[1].childNodes[0].value.trim();

          let resultOrLocation: string;
          if (gameHTMLNode[11].childNodes[0].childNodes[1]) {
            resultOrLocation = gameHTMLNode[11].childNodes[0].childNodes[1].childNodes[0].value.trim();
          } else {
            resultOrLocation = 'Reporté';
          }

          calendarOfGames[dayIndex][gameOfDayIndex] = {
            date,
            firstTeam,
            secondTeam,
            resultOrLocation,
          };

          numberOfParsedDivTags += 1;
          if (gameOfDayIndex === 3) {
            gameOfDayIndex = 0;
            dayIndex += 1;
          } else {
            gameOfDayIndex += 1;
          }
        }
      }
    });

    res.status(200).json(calendarOfGames);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
