import random
from locust import HttpUser, TaskSet, between

hats = [
  'baby',         'bucket',      'beach',
  'spinner',      'cartoon',     'skull',
  'blob',         'santa',       'st-patricks',
  'santa',        'graduation',  'blob',
  'pirate',       'pokemon',     'clown',
  'spy',          'st-patricks', 'mario',
  'tophat',       'pilot',       'tophat',
  'construction', 'beach',       'poop',
  'turkey',       'pepe',        'st-patricks',
  'shark',        'alien',       'penguin',
  'tinyhat',      'cat-ears',    'spicy',
  'PIXIE'
]

def index(l):
    l.client.get("/")


def browseProduct(l):
    l.client.get("/" + random.choice(hats))

class UserBehavior(TaskSet):

    def on_start(self):
        index(self)

    tasks = {index: 1,
        browseProduct: 20,
    }

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 2)