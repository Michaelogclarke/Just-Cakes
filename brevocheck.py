from brevo import Brevo
import psycopg2
import os
import requests
from dotenv import load_dotenv
load_dotenv()
client = Brevo(
    api_key=os.environ["BREVO_API_KEY"],
)

response = requests.get("https://api.brevo.com/v3/contacts/lists/3/contacts", headers={"api-key": os.environ["BREVO_API_KEY"]}, params={"limit": 500,
  "offset": 0})

data = response.json()
if response.status_code != 200 or 'contacts' not in data:
    print("API error:", data)
    exit(1)
contacts = data['contacts']
conn = psycopg2.connect(os.environ["DATABASE2_POSTGRES_URL"])
cur = conn.cursor()
cur.execute('SELECT "customerEmail" FROM "Order";')
x = cur.fetchall()
db_emails = {row[0].lower() for row in x if row[0]}

brevo_emails = {c['email'].lower() for c in contacts if c.get('email')}

duplicates = db_emails & brevo_emails
non_duplicates = db_emails - brevo_emails

def checks():

    print(f"Found {len(duplicates)} duplicate(s):")
    for email in duplicates:
        print(" ", email)

    print(f"\nFound {len(non_duplicates)} non-duplicate(s) to add to Brevo:")
    for email in non_duplicates:
        print(" ", email)

def create_contact():
    for email in db_emails:
        client.contacts.create_contact(email=email, list_ids=[3])

def amount():
    amount = len(brevo_emails)
    print(amount)
amount()

