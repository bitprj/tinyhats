package main

import (
	"github.com/gofiber/fiber/v2"
	"os"
	"log"
	"fmt"
	"database/sql"
	_"github.com/go-sql-driver/mysql"
	"encoding/json"
	"encoding/base64"
	"net/http"
	"bytes"
	"mime/multipart"
	"io"
)

func main() {
	// Initialize the application
	app := fiber.New()

	fmt.Println("Started")

	// Hello, World!
	app.Get("/admin", func(c *fiber.Ctx) error {
		fmt.Println("--------------------------")
		log.Print("List hats that need moderation")

		var result string
			
		result = UnmoderatedPic()

		c.Append("Content-Type", "application/json")
		return c.SendString(result)
	})

	// Listen and Server in 0.0.0.0:$PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = "4040"
	}

	log.Fatal(app.Listen(":" + port))
}

var password string = os.Getenv("PASSWORD")
var endpoint string = os.Getenv("HOST")

type Hats struct {
	// Key 		  int 	 `field:id`
    ID            string `field:"keyId"`                      
    Url           string `field:"base64"`           
    // FileName      string `field:"fileName"`           
    Description   string `field:"description"`
	Base64		  string
    // Approve       string `field:"approve"`
}

var hats []Hats
var hat Hats

func UnmoderatedPic() string {
	hats = nil
	var result string
	fmt.Println("Showing unmoderated pictures.")

	// open connection
	db, err := sql.Open("mysql", "admin:" + password + "@tcp(" + endpoint + ":3306)/main")
	if err != nil {
		log.Print("Database unreachable.")
		result = "We had trouble connecting to the database."
		// panic(err.Error())
	  }
	defer db.Close()
	
	// query for id and drop picture
	rows, err := db.Query("SELECT keyId, url, description FROM main.images WHERE approve='false'")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		hat := new(Hats)

		err = rows.Scan(&hat.ID, &hat.Url, &hat.Description)

		if err != nil {
			fmt.Println(err)
		}

		hat.Base64 = createSampleImage(hat.Url)
		fmt.Println("hat: ", hat)
		hats = append(hats, *hat)
	}

	hatJson, _ := json.Marshal(hats)
	result = string(hatJson)
	// result = fmt.Sprint(json.Marshal(hats))

	if err := rows.Err(); err != nil {
		fmt.Println(err)
	}

	return result
}

func createSampleImage(hatUrl string) string {
	var buf []byte

	hat_binary, err := base64.URLEncoding.DecodeString(hatUrl)
	hat_response := bytes.NewBuffer(hat_binary)

	ross_response, err := http.Get("http://tinyhats.s3.us-east-2.amazonaws.com/bobross.png")
	if err != nil {
		fmt.Println(err)
		return "error"
	}
	defer ross_response.Body.Close()

	fmt.Println("Downloaded pictures and packaging them for multipart...")
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	baby, err := writer.CreateFormFile("file", "hat")
	_, err = io.Copy(baby, ross_response.Body)
	hat, err := writer.CreateFormFile("file", "hat")
	_, err = io.Copy(hat, hat_response)
	
	err = writer.Close()

	fmt.Println("")
	manipulateEndpoint := "manipulation-service:80"
	manipulateUrl := fmt.Sprintf(`http://%s/manipulate?rotate=1&translate=1`, manipulateEndpoint)
	req, err := http.NewRequest("POST", manipulateUrl, body)
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
		buf, _ = io.ReadAll(body)
	}

	return string(buf)
}