#!/usr/bin/env python3
"""
Simple test script to verify OpenAI and Gemini API keys are working
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path so we can import from config
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

def test_openai_api():
    """Test OpenAI API key"""
    try:
        import openai

        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            print("❌ OPENAI_API_KEY not found in environment")
            return False

        client = openai.OpenAI(api_key=openai_key)

        # Simple test request
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'Hello from OpenAI'"}],
            max_tokens=10
        )

        print("✅ OpenAI API key is working!")
        print(f"   Response: {response.choices[0].message.content.strip()}")
        return True

    except ImportError:
        print("❌ OpenAI library not installed. Run: pip install openai")
        return False
    except Exception as e:
        print(f"❌ OpenAI API key test failed: {e}")
        return False

def test_gemini_api():
    """Test Gemini API key"""
    try:
        import google.generativeai as genai

        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            print("❌ GEMINI_API_KEY not found in environment")
            return False

        genai.configure(api_key=gemini_key)

        # Simple test request
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'Hello from Gemini'")

        print("✅ Gemini API key is working!")
        print(f"   Response: {response.text.strip()}")
        return True

    except ImportError:
        print("❌ Google Generative AI library not installed. Run: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ Gemini API key test failed: {e}")
        return False

def test_config_loader():
    """Test our config loader"""
    try:
        from config.config_loader import ConfigLoader, get_llm_config

        print("\n📋 Testing config loader...")
        loader = ConfigLoader()

        # Test if keys are properly loaded
        if loader.validate_api_keys():
            print("✅ Config loader validation passed")
        else:
            print("❌ Config loader validation failed")

        # Show the loaded config
        config = get_llm_config()
        print(f"   Temperature: {config.get('temperature')}")
        print(f"   Cache seed: {config.get('cache_seed')}")
        print(f"   Number of models configured: {len(config.get('config_list', []))}")

        return True

    except Exception as e:
        print(f"❌ Config loader test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔑 Testing API Keys...")
    print("=" * 50)

    openai_works = test_openai_api()
    print()
    gemini_works = test_gemini_api()
    print()
    config_works = test_config_loader()

    print("\n" + "=" * 50)
    print("📊 Summary:")
    print(f"   OpenAI API: {'✅ Working' if openai_works else '❌ Failed'}")
    print(f"   Gemini API: {'✅ Working' if gemini_works else '❌ Failed'}")
    print(f"   Config Loader: {'✅ Working' if config_works else '❌ Failed'}")

    if openai_works and gemini_works and config_works:
        print("\n🎉 All tests passed! Your API keys are working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")