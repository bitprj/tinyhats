import random
from locust import HttpUser, TaskSet, between

products = [
    'admin?password="ilovecats"',
    'admin?password="ilovecats'
    ]

def index(l):
    l.client.get("/")


def browseProduct(l):
    l.client.get("/" + random.choice(products))

class UserBehavior(TaskSet):

    def on_start(self):
        index(self)

    tasks = {index: 1,
        browseProduct: 20,
    }

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 10)
