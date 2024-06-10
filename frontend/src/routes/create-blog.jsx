import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Box } from "@mui/material";

export default function CreateBlog() {

    return (
        <Box className="editor">
            <CKEditor editor={ClassicEditor}
                data="<p>Hello from CKEditor&nbsp;5!</p>"
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event) => {
                    console.log(event);
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }} />
        </Box>
    )
}