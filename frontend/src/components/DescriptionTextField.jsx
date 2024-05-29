import { Container, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import { modules, modulesCard } from "../helper/quillModule";


export default function DescriptionTextField({isError, setIsError, course, setCourse, actionData}) {
    

    return (
        <Container className="ql-editor-container">
            <fieldset className="quill-fieldset">
                {isError && actionData?.message ?

                    Object.entries(JSON.parse(actionData.message)).map(function ([key, value]) {
                        if (key === 'description') {
                            return <legend style={{ color: 'red', visibility: 'visible', bottom: '96%' }}>{key}: {value}</legend>;
                        } else {
                            return null;
                        }
                    })

                    : <legend style={{ bottom: '96%' }}>Your Course's Description</legend>

                }
                <ReactQuill
                    onChange={value => {
                        setCourse({
                            ...course,
                            description: value
                        });
                        setIsError(false);
                    }}
                    value={course.description}
                    modules={modules}
                    className={isError ? 'ql-description ql-error' : 'ql-description'}
                    placeholder="Your Course's Description"
                    style={{ border: isError ? '1px solid red' : '' }}
                />
            </fieldset>
            <TextField type="hidden" value={course.description} name="description" />  {/* we need the name attribute when sending this data to server, hence the hidden */}
            <TextField type="hidden" name="is_draft" />
        </Container>
    )
}