export interface CourseInfo {
    weeks: number[];
    weekIndex: number;
    courseIndex: number;
    location: string;
}

export const WeekNameMap: Omit<any, number> = {
    星期一: 0,
    星期二: 1,
    星期三: 2,
    星期四: 3,
    星期五: 4,
    星期六: 5,
    星期日: 6,
};

export const CourseIndexMap: Omit<any, number> = {
    "1-2": 0,
    "3-4": 1,
    "5-6": 2,
    "7-8": 3,
    "9-10": 4,
    "11-12": 5,
};

export const TimeTable = [
    {
        startTime: [8, 0],
        endTime: [8, 50],
    },
    {
        startTime: [8, 55],
        endTime: [9, 45],
    },
    {
        startTime: [10, 0],
        endTime: [10, 50],
    },
    {
        startTime: [10, 55],
        endTime: [11, 45],
    },
    {
        startTime: [14, 0],
        endTime: [14, 50],
    },
    {
        startTime: [14, 55],
        endTime: [15, 45],
    },
    {
        startTime: [16, 0],
        endTime: [16, 50],
    },
    {
        startTime: [16, 55],
        endTime: [17, 45],
    },
    {
        startTime: [18, 45],
        endTime: [19, 35],
    },
    {
        startTime: [19, 40],
        endTime: [20, 30],
    },
    {
        startTime: [20, 45],
        endTime: [21, 35],
    },
    {
        startTime: [21, 40],
        endTime: [22, 30],
    },
];