import random
from locust import HttpUser, TaskSet, between

def index(l):
    l.client.get("/")


def browseProduct(l):
    l.client.get("/")

# Users will specify their own hat (ex: http://gateway-service/hat)

class UserBehavior(TaskSet):

    def on_start(self):
        index(self)

    tasks = {index: 1,
        browseProduct: 20,
    }

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 2)