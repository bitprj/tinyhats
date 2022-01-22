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
    Description   string `field:"description"`                      
    Hat           string `field:"hat"`           
    // FileName      string `field:"fileName"`           
    Preview1      string `field:"preview1"`
	Preview2      string `field:"preview2"`
    // Approve       string `field:"approve"`
}

var hats []Hats
var hat Hats

func hatPreviews() string {
	hats = nil
	var result string
	fmt.Println("Showing hats.")

	// open connection
	db, err := sql.Open("mysql", "admin:" + password + "@tcp(" + endpoint + ":3306)/main")
	if err != nil {
		log.Print("Database unreachable.")
		result = "We had trouble connecting to the database."
		// panic(err.Error())
	  }
	defer db.Close()
	
	// query for id and drop picture
	rows, err := db.Query("SELECT description, hat, preview1, preview2 FROM main.images")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		hat := new(Hats)

		err = rows.Scan(&hat.Description, &hat.Hat, &hat.Preview1, &hat.Preview2)

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
