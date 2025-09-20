import os
import json
from pathlib import Path
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class ConfigLoader:
    def __init__(self, config_path: str = None):
        if config_path is None:
            config_path = Path(__file__).parent / "llm_config.json"
        self.config_path = config_path
        self.config = self.load_config()

    def load_config(self) -> Dict[str, Any]:
        with open(self.config_path, 'r') as f:
            config = json.load(f)

        config = self._replace_env_variables(config)
        return config

    def _replace_env_variables(self, obj: Any) -> Any:
        if isinstance(obj, dict):
            return {k: self._replace_env_variables(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._replace_env_variables(item) for item in obj]
        elif isinstance(obj, str) and obj.startswith("ENV:"):
            env_var_name = obj[4:]
            env_value = os.getenv(env_var_name)
            if env_value is None:
                raise ValueError(f"Environment variable {env_var_name} not found. Please set it in your .env file.")
            return env_value
        else:
            return obj

    def get_config_list(self) -> List[Dict[str, Any]]:
        return self.config.get("config_list", [])

    def get_llm_config(self) -> Dict[str, Any]:
        return {
            "config_list": self.get_config_list(),
            "temperature": self.config.get("temperature", 0.1),
            "cache_seed": self.config.get("cache_seed", 42)
        }

    def validate_api_keys(self) -> bool:
        try:
            config_list = self.get_config_list()
            for config in config_list:
                api_key = config.get("api_key")
                if not api_key or api_key == "your_openai_api_key_here" or api_key == "your_gemini_api_key_here":
                    model = config.get("model", "Unknown")
                    print(f"Warning: API key for {model} is not properly configured")
                    return False
            return True
        except Exception as e:
            print(f"Error validating API keys: {e}")
            return False


def get_llm_config():
    loader = ConfigLoader()
    return loader.get_llm_config()