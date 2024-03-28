# Range Next Test

## Objective
The Range component is designed to provide a customizable slider functionality for selecting values within a specified range. It offers two distinct modes: a normal range and a fixed values range, each with its own set of features and use cases.

## Exercise
You have been tasked with creating the Range component using React. The component should meet the following requirements:

### Normal Range:
- The component must not use the HTML5 input range element; it must be a custom implementation.
- Users should be able to drag two bullets along the range line to select a range of values.
- Clicking on either currency number label (min or max) should allow users to set a new value within the range.
- Values selected must not be less than the minimum or greater than the maximum input values.
- When hovering over a bullet, it should increase in size and change the cursor to indicate that it is draggable.
- Dragging a bullet should change the cursor to indicate dragging.
- The range must enforce that the minimum value cannot be greater than the maximum value.
- Provide a mocked HTTP service returning min and max values to be used in the component.
- Implement as many unit tests as possible to ensure functionality and reliability.

### Fixed Values Range:
- Similar to the normal range, the component must be a custom implementation, not using the HTML5 input range element.
- Users should only be able to select values from a predefined range of options.
- Provide a mocked HTTP service that returns an array of fixed values.
- Currency values should be displayed as labels and not be editable inputs.
- Users should be able to drag two bullets along the range line to select a range of values.
- The range must enforce that the minimum value cannot be greater than the maximum value.
- Provide a mocked service returning min and max values to be used in the component.
- Implement unit tests to ensure functionality and reliability.
  
## How to Run
To run the Range component and its associated exercises, follow these steps:
1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Start the development server with `npm run dev`.
4. Access the exercises via `localhost:8080/exercise1` and `localhost:8080/exercise2` routes.
5. To run test `npm test`.

To simulate the database, run the following command:
```bash
json-server --watch server/db.json
