package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/gin-gonic/gin"
)

type RenderTask struct {
	Template string      `json:"template" binding:"required"`
	Data     interface{} `json:"data" binding:"required"`
}

func main() {
	actxt, cancelActxt := chromedp.NewRemoteAllocator(context.Background(), getDebugURL())
	defer cancelActxt()

	ctx, cancel := chromedp.NewContext(actxt)
	defer cancel()

	r := gin.Default()
	r.POST("/generate", func(c *gin.Context) {
		var task RenderTask
		c.BindJSON(&task)
		filename, err := RenderImage(task, ctx)
		if err != nil {
			log.Print(err)
			c.AbortWithStatus(500)
		}
		c.File(filename)
	})

	os.Setenv("PORT", "3000")

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func toJSONString(data interface{}) string {
	bytes, err := json.Marshal(data)
	if err != nil {
		log.Print(err)
		return ""
	}
	return string(bytes)
}

func RenderImage(task RenderTask, ctx context.Context) (string, error) {
	addr, err := net.LookupHost("web")
	if err != nil {
		panic(err)
	}
	fmt.Println("Taking screenshot")

	var buf []byte
	ch := make(chan int)
	RunContainer(task.Template, ch)

	tempFilename := "screenshot.png"

	for {
		if err := chromedp.Run(ctx, chromedp.Tasks{
			chromedp.Navigate("http://" + addr[0] + ":8080"),
			chromedp.WaitVisible("#target", chromedp.ByID),
			chromedp.Screenshot("#target", &buf, chromedp.NodeVisible, chromedp.ByID),
		}); err != nil {
			log.Println(err)
			time.Sleep(2 * time.Second)
			continue
		}
		if err := ioutil.WriteFile(tempFilename, buf, 0o644); err != nil {
			log.Fatal(err)
			return "", errors.New("FAILED TO WRITE TO FILE")
		}
	}

	ch <- 1

	return tempFilename, nil
}

func getDebugURL() string {
	addr, err := net.LookupHost("chromedp")
	if err != nil {
		panic(err)
	}
	fmt.Println(addr)

	resp, err := http.Get("http://" + addr[0] + ":9222/json/version")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(resp)

	var result map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Fatal(err)
	}
	url := result["webSocketDebuggerUrl"].(string)
	fmt.Println(url)
	return url
}
