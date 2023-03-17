import { render, screen, cleanup } from '@testing-library/react'
import Header from './Header'
import Typography from '@mui/material/Typography';
import { configure, shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom'

configure({ adapter: new Adapter() });

let wrapper;

beforeEach(() => {
    wrapper = shallow(<Header />);
});

afterEach(() => {
    cleanup();
});

describe("<Header />", () => {
    describe("<Header /> unit tests", () => {
        it("should render header", () => {
            render(<Header />);
            var headerElement = screen.getByTestId("head");
            expect(headerElement).toBeInTheDocument();
        })
    
        it("should match the snapshot", () => {
            expect(wrapper.html()).toMatchSnapshot();
        })
    
        it("should have application title", () => {
            expect(wrapper.find(Typography)).toHaveLength(1);
            expect(wrapper.find(Typography).text()).toEqual("DataGraph");
        })
    
        it("should have correct props for application title", () => {
            expect(wrapper.find(Typography).props()).toEqual({
                variant: 'h6',
                component: 'div',
                sx: { flexGrow: 1, display: { xs: 'none', sm: 'block' } },
                children: 'DataGraph'
            });
        });
    
        it("renders self and Filters component", () => {
            const { getByTestId } = render(<Header data={[]} changeNodesOpacity={()=>{}} clearFilters={()=>{}} />);
            const headerNode = getByTestId('head');
            const filtersNode = getByTestId('filters');
            expect(headerNode).toBeInTheDocument();
            expect(filtersNode).toBeInTheDocument();
        });
    })
})

