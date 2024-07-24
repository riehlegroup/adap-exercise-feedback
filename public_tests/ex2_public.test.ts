import { GradedTest } from "../../grader";
import path from 'path';

const resultsFile = path.join(__dirname, '../../results/results_ex2.json');

describe("Exercise 2", () => {
  describe("Rubric 2", () => {
    const RUBRIC_NAME = "Class Structure ex2";
    const EXERCISE_NUMBER = 2

    GradedTest({
      exerciseNumber: EXERCISE_NUMBER,
      rubricName: RUBRIC_NAME,
      testCaseName: "Ex2_1_PUBLIC",
      hintOnFailure: "Setup the grader correctly!",
      testCase: () => {
        //This is the actual test, here just a dummy
        expect(5).toEqual(5);
      },
      resultsFile,
    });
  });
  describe("Rubric 2_1", () => {
    const RUBRIC_NAME = "Class Structure ex2 subtest 2";
    const EXERCISE_NUMBER = 2

    GradedTest({
      exerciseNumber: EXERCISE_NUMBER,
      rubricName: RUBRIC_NAME,
      testCaseName: "Ex2_2_PUBLIC",
      hintOnFailure: "Setup the grader correctly!",
      testCase: () => {
        //This is the actual test, here just a dummy
        //Fail on purpose to emulate a failing task
        expect(3).toEqual(5);
      },
      resultsFile,
    });
  });
});
