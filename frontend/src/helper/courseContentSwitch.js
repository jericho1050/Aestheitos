import { createSection, deleteSection, updateSection } from "../courses";

export default async function courseContentSwitch(intent, sectionId, formData, section, error) {
    switch (intent) {
        case 'createAccordion':
            let courseContentId = formData.get('courseContentId')
            section = await createSection(courseContentId, formData);
            if (section?.statusCode) {
                if (section.statusCode >= 400) {
                    error = { ...section };
                    return error;
                }
            }
            break;
        case 'updateAccordion':
            section = await updateSection(sectionId, formData);
            if (section?.statusCode) {
                if (section.statusCode >= 400) {
                    error = { ...section };
                    return error
                }
            }
            break;
        case 'deleteAccordion':
            section = await deleteSection(sectionId);
            if (section?.statusCode) {
                if (section.statusCode >= 400) {
                    error = { ...section };
                    return error
                }
            }
            break;
    }
    return {section };

}







// if (intent === 'createAccordion') {
//     let courseContentId = formData.get('courseContentId')
//     section = await createSection(courseContentId, formData);
//     if (section?.statusCode) {
//         if (section.statusCode >= 400) {
//             error = { ...section };
//             return error;
//         }
//     }
// }


// if (intent === 'updateAccordion') {
//     section = await updateSection(sectionId, formData);
//     if (section?.statusCode) {
//         if (section.statusCode >= 400) {
//             error = { ...section };
//             return error
//         }
//     }
// }


// if (intent === 'deleteAccordion') {
//     section = await deleteSection(sectionId);
//     if (section?.statusCode) {
//         if (section.statusCode >= 400) {
//             error = { ...section };
//             return error
//         }
//     }
// }