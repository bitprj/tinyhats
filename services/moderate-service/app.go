package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Initialize the application
	app := fiber.New()

	// Hello, World!
	app.Get("/moderate", func(c *fiber.Ctx) error {
		var approval string = c.Query("approve")
		var id string = c.Query("id")
		var result string

		if approval == "true" {
			result = `Thank you for approving! The image had an id of ` + id
		} else if approval == "false" {
			result = "We're sorry that image " + id + " wasn't suitable. Thanks for your help!"
		} else if approval == "" || id == "" {
			result = "Please access a link from a valid moderation email."
		}

		return c.SendString(result)
	})

	// Listen and Server in 0.0.0.0:$PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen(":" + port))
}