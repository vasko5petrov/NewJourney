import { NewJourneyPage } from './app.po';

describe('new-journey App', () => {
  let page: NewJourneyPage;

  beforeEach(() => {
    page = new NewJourneyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
