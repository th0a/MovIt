# configures terraform to use the AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.74.2"
    }
  }

  required_version = ">= 1.2.0"
}

# configures the AWS provider
provider "aws" {
  region = "us-east-1"
}

# define an ECS cluster for taskMovIt
resource "aws_ecs_cluster" "taskMovIt_cluster" {
  name = "taskMovIt_cluster"
}

# adopt the default role created by AWS to run the task under
data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# define a task for the frontend webserver
resource "aws_ecs_task_definition" "taskMovIt_frontend_webserver" {
  family                   = "taskMovIt_frontend_webserver"
  task_role_arn            = "${data.aws_iam_role.ecs_task_execution_role.arn}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution_role.arn}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name      = "frontend_webserver"
      image     = "025429118793.dkr.ecr.us-east-1.amazonaws.com/movit:latest"
      essential = true
      command   = ["nginx", "-g", "daemon off;"]
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

#ADDED FOR BACKEND
# define a task for the backend
resource "aws_ecs_task_definition" "taskMovIt_backend_webserver" {
  family                   = "taskMovIt_backend_webserver"
  task_role_arn            = "${data.aws_iam_role.ecs_task_execution_role.arn}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution_role.arn}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name      = "backend_webserver"
      image     = "025429118793.dkr.ecr.us-east-1.amazonaws.com/movitbackend:latest"
      essential = true
      command   = []
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}


# create a security group
#
# this is used to allow network traffic to reach our containers
resource "aws_security_group" "taskMovIt_security_group" {
  name = "taskMovIt_security_group"
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
    ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# adopt the default AWS VPC as a resource in terraform. see:
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/default_vpc
resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "default VPC"
  }
}

# create subnets in two availability zones
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

resource "aws_subnet" "taskMovIt_subnet" {
  count                   = "${length(var.availability_zones)}"
  vpc_id                  = aws_default_vpc.default_vpc.id
  cidr_block              = cidrsubnet(aws_default_vpc.default_vpc.cidr_block, 4, count.index + 1)
  availability_zone       = "${var.availability_zones[count.index]}"
  map_public_ip_on_launch = false
}

# create a load balancer to distribute traffic to the tasks described below
resource "aws_lb" "taskMovIt_load_balancer" {
  name               = "taskMovIt-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.taskMovIt_security_group.id]
  subnets            = aws_subnet.taskMovIt_subnet.*.id
}


#ADDED FOR BACKEND
# create a load balancer to distribute traffic to the tasks described below for BACKEND
resource "aws_lb" "taskMovItBackend_load_balancer" {
  name               = "taskMovItBackend-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.taskMovIt_security_group.id]
  subnets            = aws_subnet.taskMovIt_subnet.*.id
}

# create a target group for the load balancer described above
resource "aws_lb_target_group" "taskMovIt_target_group" {
  name        = "taskMovIt-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_default_vpc.default_vpc.id
  target_type = "ip"
  depends_on  = [
    aws_lb.taskMovIt_load_balancer
  ]
}


#ADDED FOR BACKEND
# create a target group for the load balancer described above for BACKEND
resource "aws_lb_target_group" "taskMovItBackend_target_group" {
  name        = "taskMovItBackend-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_default_vpc.default_vpc.id
  target_type = "ip"
  depends_on  = [
    aws_lb.taskMovItBackend_load_balancer
  ]
}

# load balancer endpoint
resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.taskMovIt_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = "arn:aws:acm:us-east-1:025429118793:certificate/a0ab9530-e388-4636-bf5c-bd29059b1128"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.taskMovIt_target_group.arn
  }
}


#ADDED FOR BACKEND
# load balancer endpoint for BACKEND
resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.taskMovItBackend_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = "arn:aws:acm:us-east-1:025429118793:certificate/31ce941b-19df-42ea-9175-8602940c9641"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.taskMovItBackend_target_group.arn
  }
}

# define a service, running 5 instances of the frontend webserver
resource "aws_ecs_service" "taskMovIt_frontend_webserver_service" {
  name                   = "taskMovIt_frontend_webserver_service"
  enable_execute_command = true
  launch_type            = "FARGATE"
  cluster                = aws_ecs_cluster.taskMovIt_cluster.id
  task_definition        = aws_ecs_task_definition.taskMovIt_frontend_webserver.id
  desired_count          = 1
  network_configuration {
    subnets          = aws_subnet.taskMovIt_subnet.*.id
    security_groups  = [aws_security_group.taskMovIt_security_group.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.taskMovIt_target_group.arn
    container_name   = "frontend_webserver"
    container_port   = 80
  }
}

#ADDED FOR BACKEND
# define a service, running 5 instances of the backend webserver
resource "aws_ecs_service" "taskMovIt_backend_webserver_service" {
  name                   = "taskMovIt_backend_webserver_service"
  enable_execute_command = true
  launch_type            = "FARGATE"
  cluster                = aws_ecs_cluster.taskMovIt_cluster.id
  task_definition        = aws_ecs_task_definition.taskMovIt_backend_webserver.id
  desired_count          = 1
  network_configuration {
    subnets          = aws_subnet.taskMovIt_subnet.*.id
    security_groups  = [aws_security_group.taskMovIt_security_group.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.taskMovItBackend_target_group.arn
    container_name   = "backend_webserver"
    container_port   = 80
  }
}

