package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
)

type Message struct {
	Key         string `json:"key"`
	FileName    string `json:"fileName"`
	Url         string `json:"url"`
	Description string `json:"description"`
	Approve     string `json:"approve"`
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
	uploadURL := fmt.Sprintf(`http://%s/upload`, uploadEndpoint)
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
		  
			w.Header().Set("Content-Type", "application/json")
			w.Write(buf)
			w.WriteHeader(200)

		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
		w.WriteHeader(200)
	}
}
