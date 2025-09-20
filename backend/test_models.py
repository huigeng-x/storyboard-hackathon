#!/usr/bin/env python3
"""
Test script for project requirements models
"""

import sys
import json
from pathlib import Path

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent))

from app.models.project import Project, ProjectRequirements, VideoType


def test_load_example_projects():
    """Test loading example project files"""
    example_files = [
        "../data/example/project.json",
        "../data/example/project_type2.json",
        "../data/example/project_type3.json"
    ]

    for file_path in example_files:
        print(f"\n🔍 Testing {file_path}")
        try:
            # Get absolute path
            abs_path = Path(__file__).parent / file_path

            with open(abs_path, 'r') as f:
                data = json.load(f)

            # Create project instance using model_validate for Pydantic v2
            project = Project.model_validate(data)
            print(f"✅ Project loaded: {project.name}")

            if project.requirements:
                print(f"   Type: {project.requirements.type.name}")
                print(f"   Audience: {project.requirements.audience}")
                print(f"   Duration: {project.requirements.duration}s")
                print(f"   Has Face: {project.requirements.has_face}")
                print(f"   Main Problem: {project.requirements.main_problem[:60]}...")

                # Check type-specific requirements
                type_reqs = project.requirements.get_type_specific_requirements()
                print(f"   Type-specific requirements: {type(type_reqs).__name__}")

        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
        except Exception as e:
            print(f"❌ Error loading {file_path}: {e}")


def test_model_validation():
    """Test model validation"""
    print("\n🧪 Testing model validation...")

    # Test valid Type 1 data
    try:
        req = ProjectRequirements(
            audience="Test audience",
            duration=120,
            type=VideoType.PRODUCT_RELEASE,
            has_face=False,
            main_problem="Test problem",
            type1_requirements={
                "key_features": "Feature 1, Feature 2",
                "typical_use_cases": "Use case 1, Use case 2",
                "core_interaction_steps": "Step 1, Step 2"
            }
        )
        print(f"✅ Valid Type 1 requirements created")
    except Exception as e:
        print(f"❌ Failed to create valid Type 1: {e}")

    # Test invalid data (negative duration)
    try:
        ProjectRequirements(
            audience="Test audience",
            duration=-10,  # Invalid negative duration
            type=VideoType.PRODUCT_RELEASE,
            has_face=True,
            main_problem="Test problem"
        )
        print("❌ Should have failed validation for negative duration")
    except Exception as e:
        print(f"✅ Correctly caught validation error for negative duration")

    # Test missing type-specific requirements
    try:
        req = ProjectRequirements(
            audience="Test audience",
            duration=120,
            type=VideoType.HOW_TO_DEMO,
            has_face=True,
            main_problem="Test problem"
            # Missing type2_requirements
        )
        print("❌ Should have failed validation for missing type2_requirements")
    except Exception as e:
        print(f"✅ Correctly caught validation error for missing type-specific requirements")


def test_json_serialization():
    """Test JSON serialization and deserialization"""
    print("\n📝 Testing JSON serialization...")

    try:
        # Create a complete project
        project_data = {
            "id": "test_001",
            "name": "Test Project",
            "description": "Test description",
            "requirements": {
                "audience": "Test audience",
                "duration": 180,
                "type": 2,
                "has_face": True,
                "main_problem": "Test problem",
                "cta": "Test CTA",
                "type2_requirements": {
                    "core_interaction_steps": "Step 1, Step 2, Step 3",
                    "where_people_make_mistakes": "Common mistake areas"
                }
            },
            "stories": ["story_001", "story_002"]
        }

        # Parse from dict
        project = Project.model_validate(project_data)
        print(f"✅ Project parsed from dict: {project.name}")

        # Convert back to dict
        project_dict = project.model_dump(exclude_none=True)
        print(f"✅ Project converted to dict")

        # Verify round-trip
        project2 = Project.model_validate(project_dict)
        print(f"✅ Round-trip successful: {project2.name}")

    except Exception as e:
        print(f"❌ JSON serialization test failed: {e}")


if __name__ == "__main__":
    print("🔑 Testing Project Requirements Models...")
    print("=" * 50)

    test_load_example_projects()
    test_model_validation()
    test_json_serialization()

    print("\n" + "=" * 50)
    print("✨ Model testing completed!")