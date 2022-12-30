import React, {  useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const Review = () => {
    const [post, setPost] = useState('')
    const [tempPost, setTempPost] = useState('')
    async function createPost() {
        console.log("clicked save btn")
        const req = await fetch('http://localhost:5000/backend/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('jwtToken'),
            },
            body: JSON.stringify({
                post: tempPost,
            }),
        })

        const data = await req.json()
        console.log("update review data: ", data)
        if (data.status === 'ok') {
            setPost(tempPost)
            setTempPost('')
        } else {
            alert(data.error)
            console.log(post)
        }
    }



    return (
        <div className="App">
            <h2>Your Review</h2>
            <CKEditor
                editor={ClassicEditor}
                // placeholder="<p>Enter your text here</p>"
                // data="<p>Hello from CKEditor 5!</p>"
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const editorData = editor.getData();
                    setTempPost(editorData)
                    console.log({ event, editor, editorData });
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
            <form onSubmit={createPost}>
                <input
                    type="hidden"
                    value={tempPost}
                />
                <input type="submit"
                    value="Save"
                    className='btn btn-default'
                    onClick={(e) => createPost()}
                />
            </form>
        </div>
    );



}


export default Review;
