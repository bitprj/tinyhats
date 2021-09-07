package main

import (
	"os"
	"log"
	// "fmt"
	"database/sql"
	_"github.com/go-sql-driver/mysql"
	// "encoding/json"
  )

var password string = os.Getenv("PASSWORD")
var endpoint string = os.Getenv("HOST")  

func ApprovePicture(id string) string {

	var result string

	// open connection
	db, err := sql.Open("mysql", "admin:"+password+"@tcp("+endpoint+":3306)/main")
	if err != nil {
		log.Print("Database unreachable.")
		result = "We had trouble connecting to the database."
		// panic(err.Error())
	}
	defer db.Close()

	// query for id and drop picture
	insert, err := db.Query("UPDATE images SET approve = 'true' WHERE keyId=" + "'" + id + "'")
	if err != nil {
		log.Print("Image " + id + " does not exist.")
		result = "Sorry, this image does not exist."
		// panic(err.Error())
	} else {
		log.Print("Image " + id + " approved.")
		result = "Thanks for the approval! You approved an image with an id of " + id + "."
	}
	defer insert.Close()

	return result
}

func DeletePicture(id string) string {
	var result string

	// open connection
	db, err := sql.Open("mysql", "admin:"+password+"@tcp("+endpoint+":3306)/main")
	if err != nil {
		log.Print("Database unreachable.")
		result = "We had trouble connecting to the database."
		// panic(err.Error())
	}
	defer db.Close()

	// query for id and drop picture
	insert, err := db.Query("DELETE FROM images WHERE keyId=" + "'" + id + "'")
	if err != nil {
		log.Print("Image " + id + " does not exist.")
		result = "Sorry, this image does not exist."
		// panic(err.Error())
	} else {
		log.Print("Image " + id + " deleted.")
		result = "We're sorry that image was not suitable. We have deleted the image with an id of " + id + "."
	}
	defer insert.Close()

	return result
}
