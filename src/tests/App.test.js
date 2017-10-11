import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import { shallow, mount, renderer } from 'enzyme';
import config from '../setupTests.js';
// import Adapter from 'enzyme-adapter-react-16';



describe('App componet unit testing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should create an instance of App', () => {
    console.log(wrapper.debug());
    // expect(wrapper.exists()).toEqual(true);
  });
})
