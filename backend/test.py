import sqlite3

# Connect to the SQLite database
# (replace 'db.sqlite3' with the path to your database file)
conn = sqlite3.connect('db.sqlite3')

# Create a cursor object
cursor = conn.cursor()

# Retrieve a list of tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables in the database:")
for table in tables:
    print(table[0])

# Loop through each table and display its contents
for table in tables:
    table_name = table[0]
    print(f"\nContents of table '{table_name}':")
    
    # Fetch all data from the current table
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    # Fetch column names
    column_names = [description[0] for description in cursor.description]
    print(" | ".join(column_names))  # Print column headers
    
    # Print each row
    for row in rows:
        print(row)

# Close the connection
conn.close()
