import {render, screen, cleanup} from '@testing-library/react'
import Loader from './Loader'
import '@testing-library/jest-dom'
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { LinearProgress } from '@mui/material';

configure({ adapter: new Adapter() });

afterEach(() => {
    cleanup();
});

describe("<Loader />", () => {

    it("should render loader", () => {
        render(<Loader />);
        var loaderElement = screen.getByTestId("loader");
        expect(loaderElement).toBeInTheDocument();
    });

    it("should render self and <LinearProgress />", () => {
        const wrapper = shallow(<Loader />);
        expect(wrapper.contains(<LinearProgress />)).toBe(true);
    });

    it("should have sx prop", () => {
        const wrapper = shallow(<Loader />);
        expect(wrapper.props().sx).toBeDefined();
        expect(wrapper.props().sx.width).toBe('100%');
    });
})