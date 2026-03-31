from brevo import Brevo
import psycopg2
import os
import requests
from dotenv import load_dotenv
load_dotenv()
client = Brevo(
    api_key=os.environ["BREVO_API_KEY"],
)

response = requests.get("https://api.brevo.com/v3/contacts/lists/2/contacts", headers={"api-key": os.environ["BREVO_API_KEY"]}, params={"limit": 500,
  "offset": 0})

data = response.json()
conn = psycopg2.connect(os.environ["DATABASE2_POSTGRES_URL"])
cur = conn.cursor()
cur.execute('SELECT "customerEmail" FROM "Order";')
x = cur.fetchall()
I = [x]
print(data)
##for contact in data['contacts']:
  #  print(contacts['email'])
    
