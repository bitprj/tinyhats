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
		log.Print("List hats with previews")

		var result string
			
		result = hatPreviews()

		c.Append("Content-Type", "application/json")
		return c.SendString(result)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "4040"
	}

	log.Fatal(app.Listen(":" + port))
}