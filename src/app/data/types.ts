interface MealDetail {
  foodId: number;
  quantity: number;
  mealType: string;
  dayNumber: number;
}

export interface CreateMealPlanParams {
  planName: string;
  healthGoal: string;
  mealPlanDetails: MealDetail[];
}

export type Role = {
  RoleID: number[];
  RoleName: string;
};
export type Account = {
  userId: number;
  fullName: string;
  avatar: string;
  email: string;
  phone: number;
  age: number;
  gender: "Male" | "Female" | "Other";
  location: string;
  role: "Admin" | "Nutritionist" | "Customer";
  status: "Active" | "Inactive";
  userPackages: UserPackage[];
};
export type UserPackage = {
  userPackageId: number;
  packageId: number;
  packageName: string;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Inactive";
};
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  age: number;
  gender: string | "male" | "female" | "not specified";
  address: string;
  avatar: string;
  fcmToken: string;
  status: string | "Active" | "Inactive";
  role: string;
};

export type Ingredient = {
  ingredientId: number;
  ingredientName: string;
  // category: string;
  // unit: string;
  carbs: number;
  fat: number;
  protein: number;
  calories: number;
  // foodId: number;
};
export type ChangeRole = {
  userId: number;
  role: string;
};
export type Food = {
  foodId: number;
  foodName: string;
  mealType: string;
  imageUrl: string;
  foodType: string;
  description: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  glucid: number;
  fiber: number;
  others: string;
  allergies: Allergy[];
  diseases: Disease[];
  ingredients: Ingredient[];
};
export type Dashboard = {
  totalUser: number;
  totalPremiumUser: number;
  totalFeedbackAI: number;
  totalMealPlan: number;
  totalPackage: number;
  totalFood: number;
  totalAllergy: number;
  totalDisease: number;
  totalIngredient: number;
  // mealPlanNumber : number;
  // packageNumber: number;
};
// Kiểu trả về của API cho revenue
export type Revenue = {
  revenue: IncludeRevenue;
};

type IncludeRevenue = {
  daily: DailyRevenue[];
  weekly: WeeklyRevenue[];
  monthly: MonthlyRevenue[];
  total: TotalRevenue;
  annual: AnnualRevenue[];
};
// Kiểu dữ liệu cho doanh thu hàng ngày
type DailyRevenue = {
  date: string;
  packageSold: number;
  totalRevenue: number;
};
type AnnualRevenue = {
  year: number;
  packageSold: number;
  totalRevenue: number;
};

// Kiểu dữ liệu cho doanh thu theo tuần
type WeeklyRevenue = {
  year: number;
  month: number;
  week: number;
  packageSold: number;
  totalRevenue: number;
};

// Kiểu dữ liệu cho doanh thu theo tháng
type MonthlyRevenue = {
  year: number;
  month: number;
  packageSold: number;
  totalRevenue: number;
};

// Kiểu dữ liệu cho doanh thu tổng
type TotalRevenue = {
  packageSold: number;
  totalRevenue: number;
};
export type TopFood = {
  map(arg0: (item: any) => any): never[];
  foodName: number;
  mealLogCount: number;
  mealPlanCount: number;
  totalCount: number;
};
export type Activity = {
  filter(arg0: (item: any) => boolean): unknown;
  map(arg0: (item: any) => any): unknown;
  activityLevel: string;
  count: number;
  percentage: number;
};
export type DietStyle = {
  filter(arg0: (item: any) => boolean): unknown;
  map(arg0: (item: any) => any): unknown;
  dietStyle: string;
  count: number;
  percentage: number;
};
export type Nutrition = {
  map(arg0: (item: any) => any): unknown;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
};

export type Goal = {
  labels: string[]; // Array of labels (strings)
  achieved: number[];
  notAchieved: number[];
  progressPercentages: number[];
};
export type Transaction = {
  userId: number;
  email: string;
  packageId: number;
  packageName: string;
  description: string;
  price: number;
  paidAt: string;
  status: string;
  expiryDate: string;
};
export type Package = {
  packageId: number;
  packageName: string;
  price: number;
  duration: number;
  description: string;
};
export type SystemConfiguration = {
  configId: number;
  name: string;
  minValue: number;
  maxValue: number;
  effectedDateTo: string;
  unit: string;
  isActive: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Feedback = {
  id: number;
  type: string;
  userId: number;
  fullName: string;
  recommendedAt: string;
  response: string;
  status: string;
  rejectReason: string;
  feedback: string;
};
export interface MealPlan {
  mealPlanId?: number;
  planName: string;
  healthGoal?: string;
  duration?: number;
  status?: string;
  aiWarning?: string;
  startAt?: string;
  createdBy?: string;
  createdAt?: Date;
  mealPlanDetails: MealPlanDetail[];
}

export interface DayFoodDetails {
  Breakfast: string[];
  Lunch: string[];
  Dinner: string[];
  Snacks: string[];
}

export interface Day {
  dayNumber: string;
  foodDetails: DayFoodDetails;
  totalCalories: number;
  totalByMealType: {
    Breakfast: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
    };
    Lunch: { calories: number; carbs: number; fat: number; protein: number };
    Snacks: { calories: number; carbs: number; fat: number; protein: number };
    Dinner: { calories: number; carbs: number; fat: number; protein: number };
  };
}
export type MealPlanDetail = {
  mealPlanDetailId: number;
  foodId: number;
  foodName: string;
  quantity: number;
  mealType: string;
  dayNumber: string;
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalProtein: number;
};

export type Allergy = {
  allergyId: number;
  allergyName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  ingredientIds: Ingredient[];
  ingredients: any;
};

export type Disease = {
  ingredients: any;
  diseaseId: number;
  diseaseName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ingredientIds: Ingredient[];
};

export type Profile = {
  token: string;
  role?: string;
  avatar?: {
    value?: string;
  }[];
};
