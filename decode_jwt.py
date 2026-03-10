import base64
s = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGFhbHd2anNocGp4dmdiZHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjE1NzAsImV4cCI6MjA4ODYzNzU3MH0"
# Add padding
s += "=" * ((4 - len(s) % 4) % 4)
print(base64.b64decode(s).decode("utf-8"))
