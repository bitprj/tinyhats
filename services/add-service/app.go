package main

import (
	"fmt"
	"net/http"
	"bytes"
	"io"
	"mime/multipart"
	"log"
)
func main() {
	createEmployeeHanlder := http.HandlerFunc(addService)
	http.Handle("/add", createEmployeeHanlder)
	http.ListenAndServe(":31337", nil)
}
func addService(w http.ResponseWriter, request *http.Request) {
	err := request.ParseMultipartForm(32 << 20) // maxMemory 32MB
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	file, multipartFileHeader, err := request.FormFile("photo")
	fmt.Println(request.PostFormValue("name"))
	//Access the photo key - First Approach
        // Create a buffer to store the header of the file in
        fileHeader := make([]byte, 512)
		
		// Copy the headers into the FileHeader buffer
		file.Read(fileHeader)

		// set position back to start.
		file.Seek(0, 0)

		name := request.FormValue("name")
		mimetype := http.DetectContentType(fileHeader)

        fmt.Printf("Name: %#v\n", multipartFileHeader.Filename)
        fmt.Printf("MIME: %#v\n", http.DetectContentType(fileHeader))
		// fmt.Println(fileHeader)
		fmt.Println(multipartFileHeader.Open())

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, err := writer.CreateFormFile("file", name)

		_, err = io.Copy(part, file)
		_ = writer.WriteField("name", name)
		_ = writer.WriteField("mimeType", mimetype)

		err = writer.Close()

		req, err := http.NewRequest("POST", "http://localhost:8080/upload", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		if err != nil {
			log.Fatal(err)
		}
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
		} else {
			body := &bytes.Buffer{}
			_, err := body.ReadFrom(resp.Body)
		if err != nil {
				log.Fatal(err)
			}
		resp.Body.Close()
			fmt.Println(resp.StatusCode)
			fmt.Println(resp.Header)
			fmt.Println(body)
		}

	// ENDPOINT := os.Getenv(“ENDPOINT”)
	// html := fmt.Sprintf(`<h2>Review this hat :tophat:</h2>
	// <h3><img src=“%s” alt=“” /></h3>
	// <p>The user has given it a style of “<b>%s</b>.“</p>
	// <h3>Be sure to consider:</h3>
	// <ul>
	// <li>Is this appropriate?</li>
	// <li>Does this picture contain an object that could be used as a hat?</li>
	// <li>Could this be easily overlayed on a head?</li>
	// </ul>
	// <p>Click <a href=“%s/moderate?approve=true&id=%s”>here</a> to approve.</p>
	// <p>Click <a href=“$%s/moderate?approve=false&id=$%s”>here</a> to disapprove.</p>
	// `, imgLink, style, ENDPOINT,id,ENDPOINT,id)
	// 
	// uploadEndpoint := os.Getenv("UPLOAD_ENDPOINT")
    // const uploadURL = fmt.Sprintf(`http://%s/upload`, uploadEndpoint)
	// emailEndpoint := os.Getenv(“EMAIL_ENDPOINT”)
    // modEmail := os.Getenv(“SEND_TO_EMAIL”)
	    // body := &bytes.Buffer{}
    // writer := multipart.NewWriter(body)
    // fw, err := writer.CreateFormField("mimeType")
    // if err != nil {
    // }
    // fw, err = writer.CreateFormField("name")
    // if err != nil {
    // }
    // fw, err = writer.CreateFormFile("file", "test.png")
    // if err != nil {
    // }
    // file, err := os.Open("test.png")
    // if err != nil {
    //     panic(err)
    // }
    // _, err = io.Copy(fw, file)
    // if err != nil {
    //     return err
    // }
    // // Close multipart writer.
    // writer.Close()
    // const urlSend = fmt.Sprintf(`http://%s/email?send=%s`, emailEndpoint, modEmail)
    // resp, err := http.Post(urlSend , “application/json”, bytes.NewBuffer(requestBody))
	// resp.Header.Add("Content-Type", writer.formDataContentType())
	// return resp


	
	w.WriteHeader(200)
	return
}

func newfileUploadRequest(uri string, name string, params map[string]string, paramName string, file multipart.File) (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(paramName, name)
	if err != nil {
		return nil, err
	}
	_, err = io.Copy(part, file)

	for key, val := range params {
		_ = writer.WriteField(key, val)
	}
	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", uri, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req, err
}
