import {render, screen, cleanup, fireEvent} from '@testing-library/react'
import ZoomControlButtons from './ZoomControlButtons';
import '@testing-library/jest-dom'

afterEach(() => {
    cleanup();
});

describe('<ZoomControlButtons />', () => {
    describe("<ZoomControlButtons /> unit tests", () => {
        it("should render zoom control buttons", () => {
            render(<ZoomControlButtons />);
            var zoomElement = screen.getByTestId("zoom-btns");
            expect(zoomElement).toBeInTheDocument();
        });
    
        it("should call onZoomIn when + button is clicked", () => {
            const  onZoomIn = jest.fn();
            render(<ZoomControlButtons onZoomIn={onZoomIn} />);
            var zoomInButton = screen.getByTestId("zoomInButton");
            fireEvent.click(zoomInButton);
            expect(onZoomIn).toHaveBeenCalledTimes(1);
        });
    
        it("should call onZoomOut when - button is clicked", () => {
            const  onZoomOut = jest.fn();
            render(<ZoomControlButtons onZoomOut={onZoomOut} />);
            var zoomOutButton = screen.getByTestId("zoomOutButton");
            fireEvent.click(zoomOutButton);
            expect(onZoomOut).toHaveBeenCalledTimes(1);
        });
    })
});
