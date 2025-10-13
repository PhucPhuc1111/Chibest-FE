export * from "./types";
export * from "./account";
export * from "./allergy";
export * from "./disease";
export * from "./food";
export * from "./ingredient";
export * from "./mealPlan";
export * from "./package";
export * from "./system-configuration";

export interface ApiResponse<T> {
  labels: [];
  achieved:[];
  notAchieved:[];
  progressPercentages:[];
  statusCode: number;
  message: string;
  data: T;
  totalCalories: number,
  totalCarbs: number,
  totalProtein: number,
  totalFat: number,
  carbsPercentage: number,
  proteinPercentage: number,
  fatPercentage: number

}