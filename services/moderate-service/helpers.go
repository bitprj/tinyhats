package main

import (
	"os"
	"log"
	"fmt"
	"database/sql"
	_"github.com/go-sql-driver/mysql"
	"encoding/json"
  )

var password string = os.Getenv("PASSWORD")
var endpoint string = os.Getenv("HOST")

type Hats struct {
	// Key 		  int 	 `field:id`
    ID            string `field:"keyId"`                      
    Url           string `field:"url"`           
    // FileName      string `field:"fileName"`           
    Description   string `field:"description"`
    // Approve       string `field:"approve"`
}

var hats []Hats
var hat Hats

func ApprovePicture(id string) string {
	
	var result string

	// open connection
	db, err := sql.Open("mysql", "admin:" + password + "@tcp(" + endpoint + ":3306)/main")
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
	db, err := sql.Open("mysql", "admin:" + password + "@tcp(" + endpoint + ":3306)/main")
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

func UnmoderatedPic() string {
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