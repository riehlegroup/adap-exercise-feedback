import { GradedTest } from "../../grader";

// Import all from the exercise directory
import * as Ex1 from "../../exercises/ex1/";

import path from 'path';

const resultsFile = path.join(__dirname, '../../results/results_ex1.json');

describe("Exercise 1", () => {
  describe("Rubric 1", () => {
    const RUBRIC_NAME = "Class Structure ex1";
    const EXERCISE_NUMBER = 1

    GradedTest({
      exerciseNumber: EXERCISE_NUMBER,
      rubricName: RUBRIC_NAME,
      testCaseName: "Ex1_1_PUBLIC",
      hintOnFailure: "The HelloWorld class is not defined!",
      testCase: () => {
        //This is the actual test, here just a dummy/exmale implementation

        const HelloWorldClass = Ex1.HelloWorld; // Access HelloWorld class
        expect(HelloWorldClass).toBeDefined();
        expect(typeof HelloWorldClass).toBe("function"); // Ensure it's a class
      },
      resultsFile,
    });
  });
});
