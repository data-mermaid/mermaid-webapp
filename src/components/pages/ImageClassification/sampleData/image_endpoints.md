## workflow

### upload image

- one `POST` per image (one at a time)
- multipart form request, not usual JSON
- nested classification status in response
  - statuses:

```
    UNKNOWN = 0
    PENDING = 1
    RUNNING = 2
    COMPLETED = 3
    FAILED = 4
```

- example:
  - POST https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/images/
    - `"collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c"`
    - `"image": <blob>`
  - response:

```json
{
  "id": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
  "updated_by": "4eb4bf65-6aee-4014-beee-04ad23484bcd",
  "classification_status": {
    "id": "4b6574a0-302c-4da5-8326-0f88912e3e56",
    "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
    "status": 1,
    "message": null,
    "data": {}
  },
  "patch_size": 224,
  "num_confirmed": 0,
  "num_unconfirmed": 0,
  "num_unclassified": 0,
  "points": [],
  "created_on": "2024-08-18T15:19:48.542038Z",
  "updated_on": "2024-08-18T15:19:49.346846Z",
  "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
  "image": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8.JPG",
  "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8_thumbnail.JPG",
  "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8=.JPG",
  "original_image_name": "(3840).JPG",
  "original_image_width": 4000,
  "original_image_height": 3000,
  "photo_timestamp": null,
  "location": null,
  "comments": null,
  "data": {
    "exif": {
      "image_description": "OLYMPUS DIGITAL CAMERA",
      "make": "OLYMPUS CORPORATION",
      "model": "TG-5",
      "orientation": "TOP_LEFT",
      "x_resolution": 314.0,
      "y_resolution": 314.0,
      "resolution_unit": "INCHES",
      "software": "Version 1.0",
      "datetime": "2017:09:06 10:33:16",
      "artist": "",
      "y_and_c_positioning": 2,
      "copyright": "",
      "_exif_ifd_pointer": 218,
      "_gps_ifd_pointer": 794,
      "compression": 6,
      "jpeg_interchange_format": 17780,
      "jpeg_interchange_format_length": 8588,
      "exposure_time": 0.00625,
      "f_number": 8.0,
      "exposure_program": "CREATIVE_PROGRAM",
      "photographic_sensitivity": 100,
      "sensitivity_type": 1,
      "exif_version": "0231",
      "datetime_original": "2017:09:06 10:33:16",
      "datetime_digitized": "2017:09:06 10:33:16",
      "offset_time": "+13:00",
      "offset_time_original": "+13:00",
      "offset_time_digitized": "+13:00",
      "exposure_bias_value": 0.0,
      "max_aperture_value": 3.0,
      "metering_mode": "PATTERN",
      "light_source": "OTHER",
      "flash": "Flash(flash_fired=False, flash_return=FlashReturn.NO_STROBE_RETURN_DETECTION_FUNCTION, flash_mode=FlashMode.COMPULSORY_FLASH_SUPPRESSION, flash_function_not_present=False, red_eye_reduction_supported=False, reserved=0)",
      "focal_length": 4.5,
      "user_comment": "",
      "temperature": 30.4,
      "pressure": 1065.0,
      "water_depth": 0.5,
      "acceleration": 987313.0,
      "color_space": "SRGB",
      "pixel_x_dimension": 4000,
      "pixel_y_dimension": 3000,
      "custom_rendered": 0,
      "exposure_mode": "AUTO_EXPOSURE",
      "white_balance": "MANUAL",
      "digital_zoom_ratio": 1.0,
      "focal_length_in_35mm_film": 25,
      "scene_capture_type": "STANDARD",
      "gain_control": 0,
      "contrast": 0,
      "saturation": "HIGH",
      "sharpness": "HARD",
      "gps_version_id": 2,
      "gps_status": "V",
      "gps_img_direction_ref": "M",
      "gps_img_direction": 190.0
    }
  },
  "created_by": "4eb4bf65-6aee-4014-beee-04ad23484bcd"
}
```

- EXIF data is stripped from the images themselves (which are stored in a public S3 bucket), but stored with the db record
- images are renamed but original image name, width, height, location, and timestamp are stored with the db record. The original file name should be displayed to the user where necessary.
- not yet implemented: normalize all images to PNG (we can normalize other things too if desirable)

### poll for classification status

- This may not be necessary by itself, because it might be easier to poll for all images (see below) with a subset of fields, including status.
- specify an image in the query params to just poll for latest status for that image
- example:
  - GET https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/statuses/?image=103502bf-dfb7-4cb6-a13f-0b7094651f0d
  - response:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "e3965a3d-4f2f-46de-af53-ca83d4af8975",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "status": 3,
      "message": null,
      "data": {}
    }
  ]
}
```

### get all images in project

- use `exclude` query param to greatly reduce response size.
- example:
  - GET https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/images/?exclude=data,points,created_by,updated_by,created_on,updated_on,original_image_width,original_image_height,location,comments,image,photo_timestamp
  - response:

```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "classification_status": {
        "id": "e3965a3d-4f2f-46de-af53-ca83d4af8975",
        "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
        "status": 3,
        "message": null,
        "data": {}
      },
      "patch_size": 224,
      "num_confirmed": 12,
      "num_unconfirmed": 13,
      "num_unclassified": 0,
      "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
      "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8_thumbnail.JPG",
      "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8=.JPG",
      "original_image_name": "(3840).JPG"
    },
    {
      "id": "13639f87-486a-4dfc-a216-e7da3e88aaf1",
      "classification_status": {
        "id": "65947823-bd24-4b08-9762-550e865f6c25",
        "image": "13639f87-486a-4dfc-a216-e7da3e88aaf1",
        "status": 4,
        "message": "All AWS config variables must be specified to use S3.",
        "data": {}
      },
      "patch_size": 224,
      "num_confirmed": 0,
      "num_unconfirmed": 0,
      "num_unclassified": 0,
      "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
      "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgkJPo1TlcFhpXn61PcT2d-xaGKjusNYk-0HaX8_GYafELRXo1DEJe0-yGMz9MSRoN8_thumbnail.JPG",
      "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgkJPo1TlcFhpXn61PcT2d-xaGKjusNYk-0HaX8_GYafELRXo1DEJe0-yGMz9MSRoN8=.JPG",
      "original_image_name": "(3840).JPG"
    },
    {
      "id": "824de367-a468-4fa3-932e-ca7f0527f383",
      "classification_status": {
        "id": "65009bda-83c1-4bf8-9b36-0602a25f4f80",
        "image": "824de367-a468-4fa3-932e-ca7f0527f383",
        "status": 4,
        "message": "[Errno 2] No such file or directory: '/tmp/classifier/0.1/efficientnet_weights.pt'",
        "data": {}
      },
      "patch_size": 224,
      "num_confirmed": 0,
      "num_unconfirmed": 0,
      "num_unclassified": 0,
      "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
      "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgloQo04wvtJU52NLnSpv_T93g0iQ0tR8ru4DDE6iG5AuMLBzk3jtsAwPRGH0bKyCeI_thumbnail.JPG",
      "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgloQo04wvtJU52NLnSpv_T93g0iQ0tR8ru4DDE6iG5AuMLBzk3jtsAwPRGH0bKyCeI=.JPG",
      "original_image_name": "(3840).JPG"
    },
    {
      "id": "fee94cd0-36a1-430a-9df8-33075796f491",
      "classification_status": {
        "id": "c9b8df6a-b14f-4844-a4c6-ea4aac38dfcb",
        "image": "fee94cd0-36a1-430a-9df8-33075796f491",
        "status": 4,
        "message": "Session.resource() missing 1 required positional argument: 'service_name'",
        "data": {}
      },
      "patch_size": 224,
      "num_confirmed": 0,
      "num_unconfirmed": 0,
      "num_unclassified": 0,
      "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
      "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgnsCUiIcEpK9G8gbiGaRT3MW48jv0NkqdxKl_-1n92ew5PcmmaGTi5uZ09jzajDUwk_thumbnail.JPG",
      "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsgnsCUiIcEpK9G8gbiGaRT3MW48jv0NkqdxKl_-1n92ew5PcmmaGTi5uZ09jzajDUwk=.JPG",
      "original_image_name": "(3840).JPG"
    }
  ]
}
```

### get individual image annotations for confirmation modal

- for each point object, annotations are ordered by score (descending)
- a point without any annotations is 'unclassified' (included in top-level `num_unclassified`)
- only one annotation can be confirmed (`is_confirmed = true`, included in top-level `num_confirmed`) per point
- example:
  - GET https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/images/103502bf-dfb7-4cb6-a13f-0b7094651f0d/
  - response:

```json
{
  "id": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
  "updated_by": "4eb4bf65-6aee-4014-beee-04ad23484bcd",
  "classification_status": {
    "id": "e3965a3d-4f2f-46de-af53-ca83d4af8975",
    "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
    "status": 3,
    "message": null,
    "data": {}
  },
  "patch_size": 224,
  "num_confirmed": 12,
  "num_unconfirmed": 13,
  "num_unclassified": 0,
  "points": [
    {
      "id": "3a423eda-669c-457c-b609-4bc36e89e78c",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 666,
      "annotations": [
        {
          "id": "0e3965e0-9cf4-4c61-9a50-8d2b7113728c",
          "point": "3a423eda-669c-457c-b609-4bc36e89e78c",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 66,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "91abe5f3-610b-473a-9f1f-0c07173a1dc4",
          "point": "3a423eda-669c-457c-b609-4bc36e89e78c",
          "benthic_attribute": "f4df7abd-3d51-42fb-8cab-5102b95fad8e",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 10,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "a637b571-dbec-445e-b1c5-0eaa331f2320",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 1333,
      "annotations": [
        {
          "id": "806b3018-cb23-45ec-9a99-e9215bac8565",
          "point": "a637b571-dbec-445e-b1c5-0eaa331f2320",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 55,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "d696063e-a078-4112-82af-0d75904c708b",
          "point": "a637b571-dbec-445e-b1c5-0eaa331f2320",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 19,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "630d6584-b1ab-49c8-aa79-7d57d21b80b5",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 2000,
      "annotations": [
        {
          "id": "eed9b795-52fc-41df-8bd2-7a6af36e8053",
          "point": "630d6584-b1ab-49c8-aa79-7d57d21b80b5",
          "benthic_attribute": "79a84274-88f2-4135-90dd-8c1a501f87d5",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 72,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "408791c2-693f-49c8-b89e-37e9b9214649",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 2666,
      "annotations": [
        {
          "id": "d5a947ff-e733-4b5c-bc13-ba7db8ddb8a6",
          "point": "408791c2-693f-49c8-b89e-37e9b9214649",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 79,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "128b074d-f806-4f11-9065-79e09c22c749",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 3333,
      "annotations": [
        {
          "id": "2316eadc-6280-43b7-91b4-029269ea267e",
          "point": "128b074d-f806-4f11-9065-79e09c22c749",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "595c4cee-1e65-4fa8-a7ed-0ca651321af5",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 666,
      "annotations": [
        {
          "id": "2ef0067e-de7d-4c23-889c-a7976d19cd73",
          "point": "595c4cee-1e65-4fa8-a7ed-0ca651321af5",
          "benthic_attribute": "4acaa53b-7ec9-4abd-bb4a-1d96b6224c0d",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 83,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 1333,
      "annotations": [
        {
          "id": "aba83892-40da-44a5-bba6-99d36326a60d",
          "point": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 51,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "ae247726-426b-454b-b52e-7a40113fb6c5",
          "point": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
          "benthic_attribute": "79a84274-88f2-4135-90dd-8c1a501f87d5",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 28,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "65ae2ad2-088b-4a6d-b90c-9beae1069df3",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 2000,
      "annotations": [
        {
          "id": "6b6f7bc9-0274-45a7-ae20-5533bad58c9c",
          "point": "65ae2ad2-088b-4a6d-b90c-9beae1069df3",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 82,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "95669ad3-2632-454b-8dd8-9b7fe1c9f14a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 2666,
      "annotations": [
        {
          "id": "98bd4f09-4ee2-4bd7-97da-0a03cafc16bb",
          "point": "95669ad3-2632-454b-8dd8-9b7fe1c9f14a",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 80,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "db989349-ed39-4ddd-a70c-40417be02fc4",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 3333,
      "annotations": [
        {
          "id": "d8890a03-d202-492c-887d-a231fb4326ca",
          "point": "db989349-ed39-4ddd-a70c-40417be02fc4",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 88,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "7fa99f82-00c6-4e6d-a6eb-161ba2d050bf",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 666,
      "annotations": [
        {
          "id": "fdbdb782-a781-4cd5-a94e-f2f2260ada1c",
          "point": "7fa99f82-00c6-4e6d-a6eb-161ba2d050bf",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "82bfe949-a504-4f88-9e8f-a916c7bf03a3",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 1333,
      "annotations": [
        {
          "id": "d5f3a227-a57c-4e35-8a8f-67ccfc166902",
          "point": "82bfe949-a504-4f88-9e8f-a916c7bf03a3",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 86,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "933895b5-3997-4799-adca-3ba2334e732a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 2000,
      "annotations": [
        {
          "id": "89bf9d69-45a7-4667-8fba-db9f9d15cc23",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 40,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "546a9465-af8d-4226-9dc2-207bac640614",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 19,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "75f86631-58cf-4f37-9f9a-a27bf8f3ee49",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 13,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "21ac7574-7e14-424f-b298-c72f28096a67",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 2666,
      "annotations": [
        {
          "id": "a02503d2-e8b2-408d-a4bc-ff0ad1578e78",
          "point": "21ac7574-7e14-424f-b298-c72f28096a67",
          "benthic_attribute": "20090bf4-868e-431b-974c-ab9be5bbdb5f",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 57,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "5d7c6b6f-b6d8-4c46-b9bf-dab02f2f5c38",
          "point": "21ac7574-7e14-424f-b298-c72f28096a67",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 10,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "77492d09-398f-4074-a298-5532ee55caca",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 3333,
      "annotations": [
        {
          "id": "dcdeff6f-f016-4965-ba91-59ee65de7cea",
          "point": "77492d09-398f-4074-a298-5532ee55caca",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 71,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "becdacd6-9bf6-49de-a4ca-89fe8e2d1a50",
          "point": "77492d09-398f-4074-a298-5532ee55caca",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 15,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 666,
      "annotations": [
        {
          "id": "a374ee6e-fb8a-415e-97d7-adfe36c56679",
          "point": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 42,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "66ca745a-7df7-468a-b5cc-56a88aaf1f06",
          "point": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 17,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "4e48eaea-ab83-4d3b-a436-875c5661e578",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 1333,
      "annotations": [
        {
          "id": "075e7a52-4966-462c-bab9-b4c076b5f265",
          "point": "4e48eaea-ab83-4d3b-a436-875c5661e578",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 79,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "83384dc1-042d-4f97-b342-d302ed8cfd03",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 2000,
      "annotations": [
        {
          "id": "b59746f6-2c83-4033-a60e-50f717c91230",
          "point": "83384dc1-042d-4f97-b342-d302ed8cfd03",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 78,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 2666,
      "annotations": [
        {
          "id": "295c9eee-93f3-46bd-9fac-cd33a482c2e5",
          "point": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 43,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "e124b4aa-a750-4c76-ae11-44f856ccf7cd",
          "point": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 24,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "f66141fa-2cb3-4f53-b508-317cff010d7a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 3333,
      "annotations": [
        {
          "id": "e1f6f4d0-78d2-47fb-9c3c-86b5a6c51d29",
          "point": "f66141fa-2cb3-4f53-b508-317cff010d7a",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "fa704708-6365-49ca-bfba-2185c36579ac",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 666,
      "annotations": [
        {
          "id": "66221e3b-8a2e-4089-86c3-bc7f8aed5a57",
          "point": "fa704708-6365-49ca-bfba-2185c36579ac",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 82,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "3e4e4a1e-a11c-444d-9b09-8248f21b6234",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 1333,
      "annotations": [
        {
          "id": "c904d555-5731-4780-8e38-e297aec557e2",
          "point": "3e4e4a1e-a11c-444d-9b09-8248f21b6234",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "8a15ccef-d513-40f9-b139-d49408ebaf94",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 2000,
      "annotations": [
        {
          "id": "ed62ad0c-2187-4669-a12f-721c2ce1c5c5",
          "point": "8a15ccef-d513-40f9-b139-d49408ebaf94",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 61,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "f4f37b96-1682-48a3-a6b5-bab2cfda01be",
          "point": "8a15ccef-d513-40f9-b139-d49408ebaf94",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 11,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "1040f4e0-0c77-490a-9088-0f11628d7300",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 2666,
      "annotations": [
        {
          "id": "4915e203-8771-4c43-bb7e-04d1cfc5bc52",
          "point": "1040f4e0-0c77-490a-9088-0f11628d7300",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 83,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "2da84afe-20cc-4dba-bbcb-515f176c498f",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 3333,
      "annotations": [
        {
          "id": "87b85152-e22f-4136-9780-5360d1cf2a15",
          "point": "2da84afe-20cc-4dba-bbcb-515f176c498f",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 84,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    }
  ],
  "created_on": "2024-08-18T15:19:48.542038Z",
  "updated_on": "2024-08-18T15:19:49.346846Z",
  "collect_record_id": "95d853ff-7a54-41a6-a3e2-7841b931496c",
  "image": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8.JPG",
  "thumbnail": "https://mermaid-image-processing.s3.amazonaws.com/mermaid/xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8_thumbnail.JPG",
  "name": "xWVj7Icua6W42kYg9w_ouFclFeVhF98KM-qJPoCdsglY5LZx0hvGDmmeyVd_3YWPhc6y-bnmftkC7YDJOo7GvwgIBxenFLfVYQ38nV_fSi8=.JPG",
  "original_image_name": "(3840).JPG",
  "original_image_width": 4000,
  "original_image_height": 3000,
  "photo_timestamp": null,
  "location": null,
  "comments": null,
  "data": {
    "exif": {
      "make": "OLYMPUS CORPORATION",
      "flash": "Flash(flash_fired=False, flash_return=FlashReturn.NO_STROBE_RETURN_DETECTION_FUNCTION, flash_mode=FlashMode.COMPULSORY_FLASH_SUPPRESSION, flash_function_not_present=False, red_eye_reduction_supported=False, reserved=0)",
      "model": "TG-5",
      "artist": "",
      "contrast": 0,
      "datetime": "2017:09:06 10:33:16",
      "f_number": 8.0,
      "pressure": 1065.0,
      "software": "Version 1.0",
      "copyright": "",
      "sharpness": "HARD",
      "gps_status": "V",
      "saturation": "HIGH",
      "color_space": "SRGB",
      "compression": 6,
      "offset_time": "+13:00",
      "orientation": "TOP_LEFT",
      "temperature": 30.4,
      "water_depth": 0.5,
      "acceleration": 987313.0,
      "exif_version": "0231",
      "focal_length": 4.5,
      "gain_control": 0,
      "light_source": "OTHER",
      "user_comment": "",
      "x_resolution": 314.0,
      "y_resolution": 314.0,
      "exposure_mode": "AUTO_EXPOSURE",
      "exposure_time": 0.00625,
      "metering_mode": "PATTERN",
      "white_balance": "MANUAL",
      "gps_version_id": 2,
      "custom_rendered": 0,
      "resolution_unit": "INCHES",
      "_gps_ifd_pointer": 794,
      "exposure_program": "CREATIVE_PROGRAM",
      "sensitivity_type": 1,
      "_exif_ifd_pointer": 218,
      "datetime_original": "2017:09:06 10:33:16",
      "gps_img_direction": 190.0,
      "image_description": "OLYMPUS DIGITAL CAMERA",
      "pixel_x_dimension": 4000,
      "pixel_y_dimension": 3000,
      "datetime_digitized": "2017:09:06 10:33:16",
      "digital_zoom_ratio": 1.0,
      "max_aperture_value": 3.0,
      "scene_capture_type": "STANDARD",
      "exposure_bias_value": 0.0,
      "y_and_c_positioning": 2,
      "offset_time_original": "+13:00",
      "gps_img_direction_ref": "M",
      "offset_time_digitized": "+13:00",
      "jpeg_interchange_format": 17780,
      "photographic_sensitivity": 100,
      "focal_length_in_35mm_film": 25,
      "jpeg_interchange_format_length": 8588
    }
  },
  "created_by": "4eb4bf65-6aee-4014-beee-04ad23484bcd"
}
```

### update annotations when closing modal

- all image object payload properties will be ignored except annotations, and modifications to these should be limited to:
  - add/replace/delete a user annotation (maximum of 1 user annotation per point)
    - a user annotation is automatically assigned `score: 100` and `is_confirmed: true`
  - update (not create or delete) a machine annotation - `is_confirmed` property only
- expected payload is entire image object, with nested annotations added/updated as necessary
  - recommended: strip all top-level properties from `image` object except `id` and `points`
  - can send minimal payload too; but any user-defined annotation missing from the `annotations` object for a point will be deleted
- example:
  - PATCH (not PUT) https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/images/103502bf-dfb7-4cb6-a13f-0b7094651f0d/
  - payload that
    - adds or replaces a user-defined annotation for the first point
    - confirms a machine-defined annotation for the second point:

```json
{
  "id": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
  "points": [
    {
      "id": "3a423eda-669c-457c-b609-4bc36e89e78c",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 666,
      "annotations": [
        {
          "benthic_attribute": "3dc38d25-ed80-4049-af16-e85f04f97cc6",
          "growth_form": null,
          "is_confirmed": true
        },
        {
          "id": "0e3965e0-9cf4-4c61-9a50-8d2b7113728c",
          "point": "3a423eda-669c-457c-b609-4bc36e89e78c",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 66,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "91abe5f3-610b-473a-9f1f-0c07173a1dc4",
          "point": "3a423eda-669c-457c-b609-4bc36e89e78c",
          "benthic_attribute": "f4df7abd-3d51-42fb-8cab-5102b95fad8e",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 10,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "a637b571-dbec-445e-b1c5-0eaa331f2320",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 1333,
      "annotations": [
        {
          "id": "806b3018-cb23-45ec-9a99-e9215bac8565",
          "point": "a637b571-dbec-445e-b1c5-0eaa331f2320",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 55,
          "is_confirmed": true,
          "is_machine_created": true
        },
        {
          "id": "d696063e-a078-4112-82af-0d75904c708b",
          "point": "a637b571-dbec-445e-b1c5-0eaa331f2320",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 19,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "630d6584-b1ab-49c8-aa79-7d57d21b80b5",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 2000,
      "annotations": [
        {
          "id": "eed9b795-52fc-41df-8bd2-7a6af36e8053",
          "point": "630d6584-b1ab-49c8-aa79-7d57d21b80b5",
          "benthic_attribute": "79a84274-88f2-4135-90dd-8c1a501f87d5",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 72,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "408791c2-693f-49c8-b89e-37e9b9214649",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 2666,
      "annotations": [
        {
          "id": "d5a947ff-e733-4b5c-bc13-ba7db8ddb8a6",
          "point": "408791c2-693f-49c8-b89e-37e9b9214649",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 79,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "128b074d-f806-4f11-9065-79e09c22c749",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 500,
      "column": 3333,
      "annotations": [
        {
          "id": "2316eadc-6280-43b7-91b4-029269ea267e",
          "point": "128b074d-f806-4f11-9065-79e09c22c749",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "595c4cee-1e65-4fa8-a7ed-0ca651321af5",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 666,
      "annotations": [
        {
          "id": "2ef0067e-de7d-4c23-889c-a7976d19cd73",
          "point": "595c4cee-1e65-4fa8-a7ed-0ca651321af5",
          "benthic_attribute": "4acaa53b-7ec9-4abd-bb4a-1d96b6224c0d",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 83,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 1333,
      "annotations": [
        {
          "id": "aba83892-40da-44a5-bba6-99d36326a60d",
          "point": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 51,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "ae247726-426b-454b-b52e-7a40113fb6c5",
          "point": "fa838ee8-314c-4f1d-a58e-eab88b5a6d50",
          "benthic_attribute": "79a84274-88f2-4135-90dd-8c1a501f87d5",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 28,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "65ae2ad2-088b-4a6d-b90c-9beae1069df3",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 2000,
      "annotations": [
        {
          "id": "6b6f7bc9-0274-45a7-ae20-5533bad58c9c",
          "point": "65ae2ad2-088b-4a6d-b90c-9beae1069df3",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 82,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "95669ad3-2632-454b-8dd8-9b7fe1c9f14a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 2666,
      "annotations": [
        {
          "id": "98bd4f09-4ee2-4bd7-97da-0a03cafc16bb",
          "point": "95669ad3-2632-454b-8dd8-9b7fe1c9f14a",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 80,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "db989349-ed39-4ddd-a70c-40417be02fc4",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1000,
      "column": 3333,
      "annotations": [
        {
          "id": "d8890a03-d202-492c-887d-a231fb4326ca",
          "point": "db989349-ed39-4ddd-a70c-40417be02fc4",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 88,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "7fa99f82-00c6-4e6d-a6eb-161ba2d050bf",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 666,
      "annotations": [
        {
          "id": "fdbdb782-a781-4cd5-a94e-f2f2260ada1c",
          "point": "7fa99f82-00c6-4e6d-a6eb-161ba2d050bf",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "82bfe949-a504-4f88-9e8f-a916c7bf03a3",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 1333,
      "annotations": [
        {
          "id": "d5f3a227-a57c-4e35-8a8f-67ccfc166902",
          "point": "82bfe949-a504-4f88-9e8f-a916c7bf03a3",
          "benthic_attribute": "350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 86,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "933895b5-3997-4799-adca-3ba2334e732a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 2000,
      "annotations": [
        {
          "id": "89bf9d69-45a7-4667-8fba-db9f9d15cc23",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 40,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "546a9465-af8d-4226-9dc2-207bac640614",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 19,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "75f86631-58cf-4f37-9f9a-a27bf8f3ee49",
          "point": "933895b5-3997-4799-adca-3ba2334e732a",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 13,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "21ac7574-7e14-424f-b298-c72f28096a67",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 2666,
      "annotations": [
        {
          "id": "a02503d2-e8b2-408d-a4bc-ff0ad1578e78",
          "point": "21ac7574-7e14-424f-b298-c72f28096a67",
          "benthic_attribute": "20090bf4-868e-431b-974c-ab9be5bbdb5f",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 57,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "5d7c6b6f-b6d8-4c46-b9bf-dab02f2f5c38",
          "point": "21ac7574-7e14-424f-b298-c72f28096a67",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 10,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "77492d09-398f-4074-a298-5532ee55caca",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 1500,
      "column": 3333,
      "annotations": [
        {
          "id": "dcdeff6f-f016-4965-ba91-59ee65de7cea",
          "point": "77492d09-398f-4074-a298-5532ee55caca",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 71,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "becdacd6-9bf6-49de-a4ca-89fe8e2d1a50",
          "point": "77492d09-398f-4074-a298-5532ee55caca",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 15,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 666,
      "annotations": [
        {
          "id": "a374ee6e-fb8a-415e-97d7-adfe36c56679",
          "point": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
          "benthic_attribute": "09226989-50e7-4c40-bd36-5bcef32ee7a1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 42,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "66ca745a-7df7-468a-b5cc-56a88aaf1f06",
          "point": "b3aff6ae-2d39-40c3-95b4-fed5064ada27",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 17,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "4e48eaea-ab83-4d3b-a436-875c5661e578",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 1333,
      "annotations": [
        {
          "id": "075e7a52-4966-462c-bab9-b4c076b5f265",
          "point": "4e48eaea-ab83-4d3b-a436-875c5661e578",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 79,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "83384dc1-042d-4f97-b342-d302ed8cfd03",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 2000,
      "annotations": [
        {
          "id": "b59746f6-2c83-4033-a60e-50f717c91230",
          "point": "83384dc1-042d-4f97-b342-d302ed8cfd03",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 78,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 2666,
      "annotations": [
        {
          "id": "295c9eee-93f3-46bd-9fac-cd33a482c2e5",
          "point": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 43,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "e124b4aa-a750-4c76-ae11-44f856ccf7cd",
          "point": "b60d292c-c4a4-4b43-8efc-eea80d1bf1cb",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 24,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "f66141fa-2cb3-4f53-b508-317cff010d7a",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2000,
      "column": 3333,
      "annotations": [
        {
          "id": "e1f6f4d0-78d2-47fb-9c3c-86b5a6c51d29",
          "point": "f66141fa-2cb3-4f53-b508-317cff010d7a",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "fa704708-6365-49ca-bfba-2185c36579ac",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 666,
      "annotations": [
        {
          "id": "66221e3b-8a2e-4089-86c3-bc7f8aed5a57",
          "point": "fa704708-6365-49ca-bfba-2185c36579ac",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 82,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "3e4e4a1e-a11c-444d-9b09-8248f21b6234",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 1333,
      "annotations": [
        {
          "id": "c904d555-5731-4780-8e38-e297aec557e2",
          "point": "3e4e4a1e-a11c-444d-9b09-8248f21b6234",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 87,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "8a15ccef-d513-40f9-b139-d49408ebaf94",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 2000,
      "annotations": [
        {
          "id": "ed62ad0c-2187-4669-a12f-721c2ce1c5c5",
          "point": "8a15ccef-d513-40f9-b139-d49408ebaf94",
          "benthic_attribute": "b76bca12-884b-4404-bb9f-97d505b0fe58",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 61,
          "is_confirmed": false,
          "is_machine_created": true
        },
        {
          "id": "f4f37b96-1682-48a3-a6b5-bab2cfda01be",
          "point": "8a15ccef-d513-40f9-b139-d49408ebaf94",
          "benthic_attribute": "ed2332ed-0762-45fb-87a3-d315e218faf1",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 11,
          "is_confirmed": false,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "1040f4e0-0c77-490a-9088-0f11628d7300",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 2666,
      "annotations": [
        {
          "id": "4915e203-8771-4c43-bb7e-04d1cfc5bc52",
          "point": "1040f4e0-0c77-490a-9088-0f11628d7300",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 83,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    },
    {
      "id": "2da84afe-20cc-4dba-bbcb-515f176c498f",
      "image": "103502bf-dfb7-4cb6-a13f-0b7094651f0d",
      "row": 2500,
      "column": 3333,
      "annotations": [
        {
          "id": "87b85152-e22f-4136-9780-5360d1cf2a15",
          "point": "2da84afe-20cc-4dba-bbcb-515f176c498f",
          "benthic_attribute": "d9086647-3a82-4634-97bc-6e10347af39b",
          "growth_form": null,
          "classifier": "b3af1f56-cc34-4fea-b9b3-40a6df99c485",
          "score": 84,
          "is_confirmed": true,
          "is_machine_created": true
        }
      ]
    }
  ]
}
```

- response: same as GET for individual image above, with modified annotations

### delete image

- example:
  - DELETE https://dev-api.datamermaid.org/v1/projects/df2bb123-5bfc-4f3f-aa88-bb102d3b2b35/classification/images/103502bf-dfb7-4cb6-a13f-0b7094651f0d/
  - response: 204
