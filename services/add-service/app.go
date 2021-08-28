package main

import (
	"fmt"
	"net/http"
	"bytes"
	"io"
	"mime/multipart"
	"log"
	"os"
	"encoding/json"
)

type Message struct {
	Key   string  `json:"key"`
	FileName string `json:"fileName"`
	Url string `json:"url"`
	Description string `json:"description"`
	Approve string `json:"approve"`
}

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

		uploadEndpoint := os.Getenv("UPLOAD_ENDPOINT")
    	uploadURL := fmt.Sprintf(`http://localhost:8080%s/upload`, uploadEndpoint)
		req, err := http.NewRequest("POST", uploadURL, body)
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
		// 	fmt.Println(resp.StatusCode)
		// 	fmt.Println(resp.Header)
			var buf []byte
			buf, _ = io.ReadAll(body)
			fmt.Println(body)
			var p Message
			newErr := json.Unmarshal(buf, &p)
			if newErr != nil {
				panic(newErr)
			}
			fmt.Println(p.Url)
		}

	// ENDPOINT := os.Getenv("ENDPOINT")
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
	
	// emailEndpoint := os.Getenv("EMAIL_ENDPOINT")
    // modEmail := os.Getenv("SEND_TO_EMAIL")

    // urlSend := fmt.Sprintf(`http://%s/email?send=%s`, emailEndpoint, modEmail)
    // emailResp, err := http.Post(urlSend, "application/octet-stream", []bytes(html))
	
	// fmt.Println(emailResp)
	w.WriteHeader(200)
}