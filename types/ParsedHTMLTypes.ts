export interface IHTMLNode {
  attrs: Array<object>;
  childNodes: Array<IHTMLNode>;
  namespaceURI: string;
  nodeName: string;
  parentNode: Array<IHTMLNode>;
  tagName: string;
  value?: string;
}

export interface IGameInformation {
  date: string;
  firstTeam: string;
  secondTeam: string;
  resultOrLocation: string;
}

export interface ICalendarOfGames {
  [index: number]: Array<IGameInformation>;
}
