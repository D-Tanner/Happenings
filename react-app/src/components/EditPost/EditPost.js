import React, { useState, useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { login } from "../../services/auth";
import { Modal, useModalContext } from "../../context/Modal"
import { updatePost, deleteImage, deletePost } from "../../services/rides"
import DeleteIcon from "@material-ui/icons/Delete"
import "./EditPost.css"

const EditPostForm = ({ post }) => {

  const history = useHistory();
  const [content, setContent] = useState(post.content)

  const [images, setAdditionalImages] = useState([])
  const [errors, setErrors] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [deleteImageList, setDeleteImageList] = useState([]);

  const {
    user,
    showPostModal,
    setShowPostModal,
    showEditPostModal,
    setShowEditPostModal,
  } = useModalContext();

  useEffect(() => {
    if (post) {
      setImageList(post.images);
    }
  }, [post]);



  const postNewPost = async (e) => {
    e.preventDefault()
    const newPost = await updatePost(post.id, user.user.id, post.rideId, content, images)

    if (newPost.errors) {
      setErrors(newPost.errors)
    } else {
      setShowEditPostModal(false)
      deleteImageList.forEach((id) => {
        deleteImage(id);
      });
    }
  };

  const deletePostById = async (e) => {
    e.preventDefault()
    const deleted = await deletePost(post.id)

    if (deleted.errors) {
      setErrors(deleted.errors)
    } else {
      setShowEditPostModal(false)
    }
  }

  const deleteImageById = (id) => {
    setDeleteImageList((prev) => [...prev, id]);
    setImageList((prev) => prev.filter((image) => image.id !== id));
  };

  const deleteImageByName = (name) => {
    let result = [];
    images.forEach((Filelist) => {
      let file = Filelist;
      let newFile = [];
      for (let key in file) {
        let number = Number(key);
        if (number || number === 0) {
          if (file[key].name !== name) {
            newFile.push(file[key]);
          }
        }
      }
      if (newFile.length > 0) result.push(newFile);
    });
    setAdditionalImages(result);
  };

  const updateContent = (e) => {
    setContent(e.target.value)
  };

  const chooseAdditionalImage = () => {
    document.getElementById('additionalFile').click();
  };

  const updateAdditionalImages = (e) => {
    const file = e.target.files;
    if (file) setAdditionalImages((prev) => [...prev, file]);
  };

  return (
    <>
      {showEditPostModal && post && (
        <Modal onClose={() => setShowEditPostModal(false)}>
          <form onSubmit={postNewPost} className="create-post-form">
            <div>
              {errors.map((error, idx) => (
                <ul className="errors" key={idx}>{error}</ul>
              ))}
            </div>
            <div>
              <textarea
                type='text'
                className="input-text-create-post"
                rows="10"
                name='description'
                placeholder="Get ready to ride!"
                onChange={updateContent}
                value={content}
                required
              ></textarea>
            </div>
            <div>
              {post &&
                imageList.map((img, idx) => (
                  <div>
                    <span>
                      <span
                        onClick={() => deleteImageById(img.id)}
                        className="delete-image-div"
                      >
                        <DeleteIcon />
                      </span>
                    </span>
                    {img.imageUrl.split(".s3.amazonaws.com/")[1]}
                  </div>
                ))}
              {images &&
                images.map((fileList) =>
                  Array.from(fileList).map((image) => (
                    <div>
                      <span>
                        <span
                          onClick={() => deleteImageByName(image.name)}
                          className="delete-image-div"
                        >
                          <DeleteIcon />
                        </span>
                      </span>
                      {image.name}
                    </div>
                  ))
                )}
              <input className="choose-image" type="button" id="loadFile" value="Choose a Additional Images" onClick={chooseAdditionalImage} />
              {/* <label for="image">   {additionalImages}</label> */}
              <input className="hide-this-button" placeholder="Choose a Thumbnail Image" multiple="true" id="additionalFile" type="file" name="image" onChange={updateAdditionalImages} />
            </div>

            <div className="submit-cancel-container">
              <button className="submit-button" type="submit">Update</button>
              <button className="delete-button" onClick={deletePostById} type="submit">Delete</button>
              <button className="cancel-button" onClick={() => setShowEditPostModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

export default EditPostForm;
