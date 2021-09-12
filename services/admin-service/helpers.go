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
    Base64           string `field:"base64"`           
    // FileName      string `field:"fileName"`           
    Description   string `field:"description"`
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
	rows, err := db.Query("SELECT keyId, base64, description FROM main.images WHERE approve='false'")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		hat := new(Hats)

		err = rows.Scan(&hat.ID, &hat.Base64, &hat.Description)

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
