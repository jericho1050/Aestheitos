export default function parseDateTime(course_updated) {
    // returns an array with a  more explicit last updated info i.e., last updated day and last updated hour 
    const course_date = new Date(course_updated);
    const now = new Date();
    const course_day_updated = course_date.getDay();
    const course_hour_updated = course_date.getHours();
    const last_updated_day = course_day_updated - now.getDay();
    const last_updated_hour =  now.getHours() - course_hour_updated;

    return [last_updated_day, last_updated_hour]
}