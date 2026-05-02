from brevo import Brevo
from brevo  import RemoveContactFromListRequestBodyEmails
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

def deletecontactsinlist():
    for email in db_emails:
        client.contacts.remove_contact_from_list(
        list_id=3,
        request=RemoveContactFromListRequestBodyEmails(emails=[email]))
def deletecontacts():
    for email in db_emails:
        client.contacts.delete_contact(
        identifier=email)


def add_missing_contacts():
    print(f"Adding {len(non_duplicates)} missing email(s) to Brevo list 3...")
    for email in non_duplicates:
        try:
            client.contacts.create_contact(email=email, list_ids=[3])
            print(f"  Added: {email}")
        except Exception as e:
            print(f"  Failed to add {email}: {e}")
    print("Done.")

add_missing_contacts()

