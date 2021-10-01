package main

import (
	"log"
	"os"
	"fmt"
	"github.com/gofiber/fiber/v2"
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