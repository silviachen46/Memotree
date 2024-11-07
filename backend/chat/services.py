from django.conf import settings
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def get_chat_response(self, user_message):
        # Make API call with just the current message
        messages = [{"role": "user", "content": user_message}]
        
        completion = self.client.chat.completions.create(
            messages=messages,
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=1024,
        )
        
        return completion.choices[0].message.content 

class GraphService:
    @staticmethod
    def parse_json_to_graph_data(json_data):
        nodes = []
        edges = []
        
        # Add root node
        root_node = {
            "id": "root",
            "type": "root",
            "data": {"label": "Schedule"},
            "position": {"x": 0, "y": 0}
        }
        nodes.append(root_node)
        
        y_offset = 100  # Vertical spacing between nodes
        x_offset = 150  # Horizontal spacing between node types
        
        # Parse tasks and related information
        if isinstance(json_data, dict):
            # Handle different possible JSON structures
            items_to_process = []
            
            if "tasks" in json_data:
                items_to_process = json_data["tasks"]
            elif "events" in json_data:
                items_to_process = json_data["events"]
            elif "items" in json_data:
                items_to_process = json_data["items"]
            
            for index, item in enumerate(items_to_process):
                # Create task/event node
                item_id = f"item_{index}"
                title = item.get("title", item.get("name", item.get("description", "Unnamed Task")))
                
                item_node = {
                    "id": item_id,
                    "type": "task",
                    "data": {
                        "label": title,
                        "details": item.get("description", ""),
                    },
                    "position": {"x": x_offset, "y": y_offset * (index + 1)}
                }
                nodes.append(item_node)
                
                # Connect to root
                edges.append({
                    "id": f"e_root_{item_id}",
                    "source": "root",
                    "target": item_id
                })
                
                # Add time information if available
                time_info = item.get("time", item.get("schedule", item.get("duration")))
                if time_info:
                    time_id = f"time_{index}"
                    time_label = ""
                    
                    if isinstance(time_info, dict):
                        start_time = time_info.get("startTime", time_info.get("start", ""))
                        end_time = time_info.get("endTime", time_info.get("end", ""))
                        time_label = f"{start_time} - {end_time}"
                    else:
                        time_label = str(time_info)
                    
                    time_node = {
                        "id": time_id,
                        "type": "time",
                        "data": {"label": time_label},
                        "position": {"x": x_offset * 2, "y": y_offset * (index + 1)}
                    }
                    nodes.append(time_node)
                    
                    # Connect task to time
                    edges.append({
                        "id": f"e_{item_id}_{time_id}",
                        "source": item_id,
                        "target": time_id
                    })
                
                # Add additional details if available
                if "details" in item or "subtasks" in item:
                    details = item.get("details", item.get("subtasks", []))
                    if isinstance(details, list):
                        for detail_idx, detail in enumerate(details):
                            detail_id = f"detail_{index}_{detail_idx}"
                            detail_node = {
                                "id": detail_id,
                                "type": "detail",
                                "data": {"label": str(detail)},
                                "position": {
                                    "x": x_offset * 3,
                                    "y": y_offset * (index + 1) + (detail_idx * 50)
                                }
                            }
                            nodes.append(detail_node)
                            edges.append({
                                "id": f"e_{item_id}_{detail_id}",
                                "source": item_id,
                                "target": detail_id
                            })
        
        return {"nodes": nodes, "edges": edges}