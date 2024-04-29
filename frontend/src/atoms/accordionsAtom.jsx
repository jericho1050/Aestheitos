import { atom } from "jotai";




const section1 = {
    heading: "Your Own Heading Here: e.g., Phase 1 (Preparation)."
}
const sectionItem1 = {
    lecture: '',
    description: " Your Description here: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor.",
    heading: "Your own item header here: e.g., ReadMe or Lecture",
    workouts: [
        {
            demo: '',
            exercise: '',
            correctForm : [],
            wrongForm: []
        }
    ]
}
const sectionItem2 = {
    lecture: '',
    description: "Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    heading: "Workout Routine",
    workouts: [
        {
            demo: '',
            exercise: '',
            correctForm : [],
            wrongForm: []
        }
    ]
}

// workout routine or the video lecture
const initialSectionData = [{
    id: 0,
    heading: section1.heading,
    items: [{
        id: 0,
        ...sectionItem1
    }, {
        id: 1,
        ...sectionItem2
    }]
}]

export const accordionsAtom = atom(initialSectionData);








