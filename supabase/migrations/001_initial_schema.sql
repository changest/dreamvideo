-- Spring FES Video - Initial Database Schema
-- Migration: 001_initial_schema
-- Description: Creates all tables, indexes, foreign keys, and storage bucket

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Create stage enum type for project workflow
CREATE TYPE project_stage AS ENUM ('draft', 'scenes', 'images', 'videos', 'completed');

-- Create image status enum
CREATE TYPE image_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create video status enum
CREATE TYPE video_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    story TEXT NOT NULL,
    style VARCHAR(100) NOT NULL DEFAULT 'default',
    stage project_stage NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries by user
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Create index on stage for filtering projects by stage
CREATE INDEX idx_projects_stage ON projects(stage);

-- Create index on created_at for sorting
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ============================================================================
-- SCENES TABLE
-- ============================================================================

CREATE TABLE scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    description TEXT NOT NULL,
    description_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    image_status image_status NOT NULL DEFAULT 'pending',
    image_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    video_status video_status NOT NULL DEFAULT 'pending',
    video_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique constraint for project_id + order_index
CREATE UNIQUE INDEX idx_scenes_project_order ON scenes(project_id, order_index);

-- Create index on project_id for faster joins
CREATE INDEX idx_scenes_project_id ON scenes(project_id);

-- Create index on image_status for filtering
CREATE INDEX idx_scenes_image_status ON scenes(image_status);

-- Create index on video_status for filtering
CREATE INDEX idx_scenes_video_status ON scenes(video_status);

-- ============================================================================
-- IMAGES TABLE
-- ============================================================================

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on scene_id for faster joins
CREATE INDEX idx_images_scene_id ON images(scene_id);

-- Create index on version for tracking image versions
CREATE INDEX idx_images_version ON images(version);

-- ============================================================================
-- VIDEOS TABLE
-- ============================================================================

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    duration FLOAT,
    task_id VARCHAR(255),
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on scene_id for faster joins
CREATE INDEX idx_videos_scene_id ON videos(scene_id);

-- Create index on task_id for tracking video generation tasks
CREATE INDEX idx_videos_task_id ON videos(task_id);

-- Create index on version for tracking video versions
CREATE INDEX idx_videos_version ON videos(version);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only access their own projects
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Scenes: Users can only access scenes in their own projects
CREATE POLICY "Users can view scenes in their own projects"
    ON scenes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert scenes in their own projects"
    ON scenes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update scenes in their own projects"
    ON scenes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete scenes in their own projects"
    ON scenes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Images: Users can only access images in their own projects
CREATE POLICY "Users can view images in their own projects"
    ON images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = images.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert images in their own projects"
    ON images FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = images.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update images in their own projects"
    ON images FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = images.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete images in their own projects"
    ON images FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = images.scene_id
            AND projects.user_id = auth.uid()
        )
    );

-- Videos: Users can only access videos in their own projects
CREATE POLICY "Users can view videos in their own projects"
    ON videos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = videos.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert videos in their own projects"
    ON videos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = videos.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update videos in their own projects"
    ON videos FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = videos.scene_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete videos in their own projects"
    ON videos FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM scenes
            JOIN projects ON projects.id = scenes.project_id
            WHERE scenes.id = videos.scene_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects table
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

-- Insert storage bucket for project media
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project-media bucket
-- Users can upload files to their own folder
CREATE POLICY "Users can upload files to their own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'project-media'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can view files in their own folder
CREATE POLICY "Users can view files in their own folder"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'project-media'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can update files in their own folder
CREATE POLICY "Users can update files in their own folder"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'project-media'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can delete files in their own folder
CREATE POLICY "Users can delete files in their own folder"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'project-media'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE projects IS 'Projects created by users containing stories to be converted to videos';
COMMENT ON TABLE scenes IS 'Individual scenes/shots within a project, generated from story breakdown';
COMMENT ON TABLE images IS 'Generated images for each scene';
COMMENT ON TABLE videos IS 'Generated videos for each scene';

COMMENT ON COLUMN projects.stage IS 'Current workflow stage: draft -> scenes -> images -> videos -> completed';
COMMENT ON COLUMN scenes.order_index IS 'Order of this scene in the project (0-based)';
COMMENT ON COLUMN scenes.description_confirmed IS 'Whether user has confirmed the scene description';
COMMENT ON COLUMN scenes.image_status IS 'Status of image generation for this scene';
COMMENT ON COLUMN scenes.image_confirmed IS 'Whether user has confirmed the generated image';
COMMENT ON COLUMN scenes.video_status IS 'Status of video generation for this scene';
COMMENT ON COLUMN scenes.video_confirmed IS 'Whether user has confirmed the generated video';
COMMENT ON COLUMN images.version IS 'Version number of the image (increments on regeneration)';
COMMENT ON COLUMN videos.version IS 'Version number of the video (increments on regeneration)';
COMMENT ON COLUMN videos.task_id IS 'External task ID from video generation API for status tracking';
