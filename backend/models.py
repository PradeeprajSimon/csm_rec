class Event:
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
