export default function parseCourseDateTime(course_updated) {
    // returns an array with a  more explicit last updated info i.e., last updated day and last updated hour 
    const course_date = new Date(course_updated);
    const now = new Date();
    const course_day_updated = course_date.getDay();
    const course_hour_updated = course_date.getHours();
    const last_updated_day = course_day_updated - now.getDay();
    const last_updated_hour = Math.abs(course_hour_updated - now.getHours());
    return [last_updated_day, last_updated_hour]
}

export function parseUserDateTime(date) {
    const date_joined = new Date(date);
    const date_joined_day = date_joined.getDay();
    const date_joined_month = date_joined.getMonth();
    const date_joined_year = date_joined.getFullYear();

    return [date_joined_day, date_joined_month, date_joined_year];
}