import React, { Component } from "react";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import { toast } from "react-toastify";

import * as actions from "actions";
// import { stat } from "fs";

class BwmFileUpload extends Component {
  constructor() {
    super();

    this.setupReader();

    this.state = {
      selectedFile: undefined,
      imagebase64: "",
      initialImagebase64: "",
      croppedImage: {},
      pending: false,
      status: "INIT",
      crop: {}
    };
  }

  setupReader = () => {
    this.reader = new FileReader();

    this.reader.addEventListener("load", e => {
      const { initialImagebase64 } = this.state;

      const imagebase64 = e.target.result;

      if (initialImagebase64) {
        this.setState({ imagebase64 });
      } else {
        this.setState({
          imagebase64,
          initialImagebase64: imagebase64
        });
      }
    });
  };

  onChange = e => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      this.setState({ selectedFile, initialImagebase64: "" });
      this.reader.readAsDataURL(selectedFile);
    }
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  resetToDefaultState = status => {
    this.setState({
      pending: false,
      status: status,
      selectedFile: undefined,
      croppedImage: {},
      initialImagebase64: "",
      imagebase64: ""
    });
  };

  onImageLoaded = image => {
    if (image.naturalWidth < 950 && image.naturalHeight < 720) {
      this.resetToDefaultState("INIT");
      toast.error("Minimun width of an image is 950px and height is 720px");
    }

    this.setState({
      crop: makeAspectCrop(
        {
          x: 0,
          y: 0,
          aspect: 16 / 9,
          width: 50
        },
        image.width / image.height
      )
    });
  };

  onCropCompleted = async (crop, pixelCrop) => {
    const { selectedFile, initialImagebase64 } = this.state;

    if (selectedFile && (pixelCrop.height > 0 && pixelCrop.width > 0)) {
      const img = new Image();
      img.src = initialImagebase64;
      const croppedImage = await getCroppedImg(
        img,
        pixelCrop,
        selectedFile.name
      );
      this.setState({ croppedImage });
      this.reader.readAsDataURL(croppedImage);
    }
  };

  onError = () => {
    this.setState({ pending: false, status: "FAIL" });
  };

  onSuccess = uploadedImage => {
    // const {
    //   input: { onChange }
    // } = this.props;

    const { onChange } = this.props.input || this.props;

    // console.log("Uploaded Image", uploadedImage);
    this.resetToDefaultState("OK");
    // this.setState({ pending: false, status: "OK" });

    onChange(uploadedImage);
  };

  uploadImage = () => {
    const { croppedImage } = this.state;

    if (croppedImage) {
      this.setState({ pending: true, status: "INIT" });
      actions.uploadImage(croppedImage).then(
        uploadedImage => {
          this.onSuccess(uploadedImage);
        },
        err => {
          this.onError(err);
        }
      );
    }
  };

  renderSpinningCircle = () => {
    const { pending } = this.state;

    if (pending) {
      return (
        <div className="img-loading-overlay">
          <div className="img-spinning-circle" />
        </div>
      );
    }
  };

  renderImageStatus = () => {
    const { status } = this.state;

    if (status === "OK") {
      return (
        <div className="alert alert-success">Image Uploaded Successfully</div>
      );
    }

    if (status === "FAIL") {
      return <div className="alert danger">Image Upload Failed</div>;
    }
  };

  render() {
    // const {
    //   label,
    //   meta: { touched, error }
    // } = this.props;

    const { selectedFile, imagebase64, crop, initialImagebase64 } = this.state;
    return (
      <div className="img-upload-container">
        <label className="img-upload btn btn-bwm">
          <span className="upload-text"> Select an Image </span>
          <input
            type="file"
            accept=".jpg, .png, .jpeg"
            onChange={this.onChange}
          />
        </label>
        {selectedFile && (
          <button
            className="btn btn-success btn-upload"
            type="button"
            disabled={!selectedFile}
            onClick={this.uploadImage}
          >
            Upload Image
          </button>
        )}

        {initialImagebase64 && (
          <ReactCrop
            src={initialImagebase64}
            crop={crop}
            onChange={crop => this.onCropChange(crop)}
            onImageLoaded={image => this.onImageLoaded(image)}
            onComplete={(crop, pixelCrop) =>
              this.onCropCompleted(crop, pixelCrop)
            }
          />
        )}

        {imagebase64 && (
          <div className="img-preview-container">
            <div
              className="img-preview"
              style={{ backgroundImage: "url(" + imagebase64 + ")" }}
            />
            {this.renderSpinningCircle()}
          </div>
        )}

        {this.renderImageStatus()}
      </div>
    );
  }
}

function getCroppedImg(image, pixelCrop, fileName) {
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      file.name = fileName;
      resolve(file);
    }, "image/jpeg");
  });
}

export default BwmFileUpload;
