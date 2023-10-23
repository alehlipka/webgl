import { Context } from "../core/Context";

it('should initialize a new instance of Context class with a valid canvas_id and return the WebGL rendering context', () => {
    // Given
    const canvasElementMock = document.createElement('canvas');
    const getContextMock = jest.fn();
    canvasElementMock.getContext = getContextMock.mockReturnValueOnce('webgl');

    const getElementByIdMock = jest.spyOn(document, 'getElementById');
    getElementByIdMock.mockReturnValueOnce(canvasElementMock);

    // When
    const context = new Context('canvas_id');

    // Then
    expect(getElementByIdMock).toHaveBeenCalledWith('canvas_id');
    expect(context.getContext()).toBe('webgl');
});

it('should throw an error if the canvas element with the specified ID is not found', () => {
    // Given
    const getElementByIdMock = jest.spyOn(document, 'getElementById');
    getElementByIdMock.mockReturnValueOnce(null);

    // When, Then
    expect(() => new Context('canvas_id')).toThrowError('Canvas with ID "canvas_id" not found');
});

it('should throw an error if the WebGL context initialization fails', () => {
    // Given
    const canvasElementMock = document.createElement('canvas');
    const getContextMock = jest.fn();
    canvasElementMock.getContext = getContextMock.mockReturnValueOnce(null);

    const getElementByIdMock = jest.spyOn(document, 'getElementById');
    getElementByIdMock.mockReturnValueOnce(canvasElementMock);

    // When, Then
    expect(() => new Context('canvas_id')).toThrowError('Context initialization fail');
});
