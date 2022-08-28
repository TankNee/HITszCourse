import payload from "./payload.json";
import { load } from "cheerio";
import { CourseIndexMap, CourseInfo, TimeTable, WeekNameMap } from "./constant";
import { createEvents } from "ics";
import fs from "fs";
/**
 * 将日期转换为指定格式
 * @param {Date} originDate
 */
const getFormatDate = (originDate: Date | null): string => {
    const date = originDate ? originDate : new Date();
    let month: number | string = date.getMonth() + 1;
    let strDate: number | string = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    const currentDate = date.getFullYear() + "-" + month + "-" + strDate;
    return currentDate;
};

/**
 * 生成一个周次与日期对应的表
 * @param startDateString 开始日期
 * @param totalWeekNum 总周数，一共有多少周
 */
const generateMapBetweenWeekAndDate = (startDateString: string, totalWeekNum: number) => {
    let date = new Date(startDateString);
    let result: Array<Array<string>> = [];
    for (let weekCounter = 0; weekCounter < totalWeekNum; weekCounter++) {
        result.push([]);
        for (let dayCounter = 0; dayCounter < 7; dayCounter++) {
            result[weekCounter].push(getFormatDate(date));
            // result.set(getFormatDate(date), weekCounter);
            date.setDate(date.getDate() + 1);
        }
    }
    return result;
};

const WeekMap = generateMapBetweenWeekAndDate("2022-08-29", 19);

function parseCourseInfoString(courseInfo: string): CourseInfo {
    const [weekString, other] = courseInfo.split("周,");

    const weeks: number[] = [];
    weekString.split(",").forEach((week) => {
        if (week.includes("-")) {
            const [w1, w2] = week.split("-").map((w) => parseInt(w));
            for (let i = w1; i <= w2; i++) {
                weeks.push(i - 1);
            }
        } else {
            weeks.push(parseInt(week) - 1);
        }
    });

    const [dayString, location] = other.split("节 ");
    const weekIndex = WeekNameMap[dayString.split("第")[0]];
    const courseIndex = CourseIndexMap[dayString.split("第")[1]];

    return {
        weeks,
        weekIndex,
        courseIndex,
        location,
    };
}

function generateCourseEvent(courseName: string, teacher: string, infoList: CourseInfo[]) {
    const events: any[] = [];
    infoList.forEach((info) => {
        info.weeks.forEach((week) => {
            const date = new Date(WeekMap[week][info.weekIndex]);
            const { startTime } = TimeTable[info.courseIndex * 2];
            const { endTime } = TimeTable[info.courseIndex * 2 + 1];
            const [sh, sm] = startTime;
            const [eh, em] = endTime;
            events.push({
                start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), sh, sm],
                end: [date.getFullYear(), date.getMonth() + 1, date.getDate(), eh, em],
                title: courseName,
                location: `哈尔滨工业大学深圳 ${info.location}`,
                calName: `${new Date().getFullYear()} 课程表`,
                organizer: {
                    name: teacher,
                },
                description: `${teacher}教授`,
            });
        });
    });
    return events;
}

/**
 * 生成ICS需要的数据
 */
const generateICSEvents = async () => {
    var courseEvents: any[] = [];
    const courses = payload["yxkcList"];

    courses.forEach((course) => {
        const info = course["pkjgmx"];
        const teacher = course["dgjsmc"] || "无教师";
        const courseName = course["kcmc"];
        const $ = load(info);
        const content: string[] = [];
        $("span")
            .children()
            .each((_, ele) => {
                content.push($(ele).text());
            });
        const infoList = content.map((info) => parseCourseInfoString(info));
        const events = generateCourseEvent(courseName, teacher, infoList);
        courseEvents = courseEvents.concat(events);
    });

    const { error, value } = createEvents(courseEvents);
    if (error || !value) {
        console.log(error);
        return;
    }
    fs.writeFileSync("courses.ics", value);
};

generateICSEvents();
