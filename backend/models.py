class Event:
    def __init__(self, id, title, description, date, time, location, category, created_at):
        self.id = id
        self.title = title
        self.description = description
        self.date = date
        self.time = time
        self.location = location
        self.category = category
        self.created_at = created_at

    @staticmethod
    def from_row(row):
        return {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "date": row["date"],
            "time": row["time"],
            "location": row["location"],
            "category": row["category"],
            "created_at": row["created_at"]
        }
