import Home from '../pages/Page';

describe('<Home />', () => {
  it('mounts', () => {
    cy.mount(<Home />);
  });
});
